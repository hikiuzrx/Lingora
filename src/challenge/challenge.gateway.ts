// src/challenge/challenge.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  type Player = {
    socket: Socket;
    username: string;
    score: number;
  };
  
  type Match = {
    id: string;
    players: [Player, Player];
    currentQuestionIndex: number;
    questions: { question: string; answer: string }[];
    answered: boolean;
  };
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ChallengeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private waitingQueue: Player[] = [];
    private matches: Map<string, Match> = new Map();
  
    handleConnection(socket: Socket) {
      console.log(`Client connected: ${socket.id}`);
    }
  
    handleDisconnect(socket: Socket) {
      console.log(`Client disconnected: ${socket.id}`);
    }
  
    @SubscribeMessage('joinQueue')
    handleJoinQueue(@ConnectedSocket() socket: Socket, @MessageBody() username: string) {
      this.waitingQueue.push({ socket, username, score: 0 });
  
      if (this.waitingQueue.length >= 2) {
        const [player1, player2] = this.waitingQueue.splice(0, 2);
        this.startMatch(player1, player2);
      }
    }
  
    startMatch(player1: Player, player2: Player) {
      const matchId = `match-${Date.now()}`;
      const questions = this.generateQuestions();
      const match: Match = {
        id: matchId,
        players: [player1, player2],
        currentQuestionIndex: 0,
        questions,
        answered: false,
      };
  
      this.matches.set(matchId, match);
  
      [player1, player2].forEach((p) => {
        p.socket.join(matchId);
        p.socket.emit('matchStarted', {
          opponent: p === player1 ? player2.username : player1.username,
          matchId,
        });
      });
  
      this.sendNextQuestion(matchId);
    }
  
    sendNextQuestion(matchId: string) {
      const match = this.matches.get(matchId);
      if (!match) return;
  
      if (match.currentQuestionIndex >= match.questions.length) {
        this.finishMatch(match);
        return;
      }
  
      const questionObj = match.questions[match.currentQuestionIndex];
      match.answered = false;
  
      this.server.to(match.id).emit('newQuestion', {
        question: questionObj.question,
        index: match.currentQuestionIndex,
      });
  
      setTimeout(() => {
        if (!match.answered) {
          match.currentQuestionIndex++;
          this.sendNextQuestion(matchId);
        }
      }, 10000); // 10 seconds per question
    }
  
    @SubscribeMessage('answer')
    handleAnswer(
      @ConnectedSocket() socket: Socket,
      @MessageBody()
      data: { matchId: string; answer: string },
    ) {
      const match = this.matches.get(data.matchId);
      if (!match || match.answered) return;
  
      const currentQuestion = match.questions[match.currentQuestionIndex];
      if (data.answer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
        match.answered = true;
  
        const player = match.players.find((p) => p.socket.id === socket.id);
        if (player) player.score++;
  
        this.server.to(match.id).emit('correctAnswer', {
          username: player?.username,
          correctAnswer: currentQuestion.answer,
        });
  
        setTimeout(() => {
          match.currentQuestionIndex++;
          this.sendNextQuestion(data.matchId);
        }, 2000); // short delay before next question
      }
    }
  
    finishMatch(match: Match) {
      const [p1, p2] = match.players;
      let winner :any= null;
      if (p1.score > p2.score) winner = p1.username;
      else if (p2.score > p1.score) winner = p2.username;
  
      this.server.to(match.id).emit('matchEnded', {
        scores: {
          [p1.username]: p1.score,
          [p2.username]: p2.score,
        },
        winner,
      });
  
      this.matches.delete(match.id);
    }
  
    generateQuestions() {
      return [
        { question: 'Capital of France?', answer: 'Paris' },
        { question: '5 + 7?', answer: '12' },
        { question: 'Fastest land animal?', answer: 'Cheetah' },
      ];
    }
  }
  