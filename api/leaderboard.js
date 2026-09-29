import { MongoClient } from 'mongodb';

// Configuração da conexão com MongoDB
const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  // Em desenvolvimento, avisa se não encontrar. Na Vercel, pegará a variável de ambiente.
  console.warn('Atenção: MONGODB_URI não foi definida nas variáveis de ambiente.');
} else {
  // Evita múltiplas conexões com o MongoDB em Serverless Functions
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default async function handler(req, res) {
  if (!clientPromise) {
    return res.status(500).json({ error: 'Banco de dados não configurado (Falta MONGODB_URI).' });
  }

  try {
    const dbClient = await clientPromise;
    const db = dbClient.db('dij-game');
    const collection = db.collection('leaderboard');

    if (req.method === 'GET') {
      // Retorna o Top 10
      const scores = await collection.find({}).sort({ score: -1 }).limit(10).toArray();
      return res.status(200).json(scores);
      
    } else if (req.method === 'POST') {
      // Salva uma nova pontuação
      const { name, score, date } = req.body;
      
      if (!name || typeof score !== 'number') {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      await collection.insertOne({ name, score, date: date || new Date().toLocaleDateString() });
      
      // Retorna a lista atualizada
      const scores = await collection.find({}).sort({ score: -1 }).limit(10).toArray();
      return res.status(201).json(scores);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Método ${req.method} não permitido`);
    }
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
