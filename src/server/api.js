import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Configuração do CORS com suporte a múltiplas origens
const allowedOrigins = [
  'https://estoque-golas-2qrusvf6s-cleilsons-projects.vercel.app', // Novo domínio do frontend
  'https://estoque-golas-cbxr311zu-cleilsons-projects.vercel.app', // Domínio anterior (se ainda usado)
  'http://localhost:3000', // Para desenvolvimento local
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rota de login
app.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { nome: nome },
    });

    if (!usuario) {
      return res.status(401).json({ autenticado: false, mensagem: 'Usuário não encontrado' });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ autenticado: false, mensagem: 'Senha incorreta' });
    }

    res.status(200).json({ autenticado: true, mensagem: 'Login bem-sucedido', usuario });
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({ autenticado: false, mensagem: 'Erro no servidor' });
  }
});

// Rota para criar novo usuário
app.post('/novousuario', async (req, res) => {
  const { nome, eadmin } = req.body;

  try {
    const novoUsuario = await prisma.usuarios.create({
      data: {
        nome: nome,
        Eadmin: eadmin,
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Falha ao criar novo usuário:', error);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});

// Rota para criar novo polo
app.post('/polos', async (req, res) => {
  try {
    const { codigo, cor, gola, punho } = req.body;

    if (!codigo || !cor || !gola || !punho || !gola.quantidade || !punho.quantidade) {
      throw new Error('Todos os campos (codigo, cor, gola.quantidade, punho.quantidade) são obrigatórios');
    }

    const novoPolo = await prisma.polo.create({
      data: {
        codigo,
        cor,
        gola: {
          create: {
            quantidade: gola.quantidade,
          },
        },
        punho: {
          create: {
            quantidade: punho.quantidade,
          },
        },
      },
      include: {
        gola: true,
        punho: true,
      },
    });

    res.status(201).json({
      message: 'Polo criado com sucesso',
      data: novoPolo,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erro ao criar Polo',
      error: error.message,
    });
  }
});

// Rota para atualizar polo
app.post('/atualizar-polo/:codigo', async (req, res) => {
  const { codigo } = req.params;
  const { cor, gola, punho } = req.body;

  try {
    const poloAtualizado = await prisma.polo.update({
      where: { codigo: codigo },
      data: {
        cor,
        gola: gola ? { update: { quantidade: Number(gola.quantidade) } } : undefined,
        punho: punho ? { update: { quantidade: Number(punho.quantidade) } } : undefined,
      },
    });
    res.json(poloAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar polo:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar o polo no banco de dados' });
  }
});

// Rota para filtrar polos por cor
app.get('/filtrar/:cor', async (req, res) => {
  const { cor } = req.params;

  try {
    const polos = await prisma.polo.findMany({
      where: { cor: cor },
      include: {
        gola: true,
        punho: true,
      },
    });

    if (polos.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum polo encontrado com essa cor' });
    }

    res.json(polos);
  } catch (error) {
    console.error('Erro ao filtrar polos por cor:', error);
    res.status(500).json({ mensagem: 'Erro ao filtrar polos no banco de dados' });
  }
});

// Rota para selecionar usuários
app.get('/select-func', async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id: true,
        nome: true,
      },
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar dados no banco de dados' });
  }
});

// Rota para trazer todos os dados
app.get('/trazer-dados', async (req, res) => {
  try {
    const dados = await prisma.polo.findMany({
      select: {
        codigo: true,
        cor: true,
        gola: {
          select: { quantidade: true },
        },
        punho: {
          select: { quantidade: true },
        },
      },
      orderBy: { codigo: 'asc' },
    });
    res.json(dados);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar dados no banco de dados' });
  }
});

// Rota para registrar entrada/saída de golas/punhos
app.post('/estoque', async (req, res) => {
  const { codigoPolo, quantidade, tipo, golaPunho } = req.body;

  const polo = await prisma.polo.findUnique({
    where: { codigo: codigoPolo },
  });

  if (!polo) {
    return res.status(400).json({ success: false, message: 'Polo não encontrado!' });
  }

  try {
    if (golaPunho === 'gola') {
      const gola = await prisma.gola.findUnique({
        where: { poloCodigo: codigoPolo },
      });

      if (tipo === 'entrada') {
        await prisma.gola.update({
          where: { poloCodigo: codigoPolo },
          data: {
            quantidade: gola ? gola.quantidade + quantidade : quantidade,
          },
        });
      } else if (tipo === 'saida') {
        if (gola && gola.quantidade >= quantidade) {
          await prisma.gola.update({
            where: { poloCodigo: codigoPolo },
            data: { quantidade: gola.quantidade - quantidade },
          });
        } else {
          return res.status(400).json({ success: false, message: 'Quantidade insuficiente de golas!' });
        }
      } else {
        return res.status(400).json({ success: false, message: "Tipo inválido. Use 'entrada' ou 'saida'." });
      }
    } else if (golaPunho === 'punho') {
      const punho = await prisma.punho.findUnique({
        where: { poloCodigo: codigoPolo },
      });

      if (tipo === 'entrada') {
        await prisma.punho.update({
          where: { poloCodigo: codigoPolo },
          data: {
            quantidade: punho ? punho.quantidade + quantidade : quantidade,
          },
        });
      } else if (tipo === 'saida') {
        if (punho && punho.quantidade >= quantidade) {
          await prisma.punho.update({
            where: { poloCodigo: codigoPolo },
            data: { quantidade: punho.quantidade - quantidade },
          });
        } else {
          return res.status(400).json({ success: false, message: 'Quantidade insuficiente de punhos!' });
        }
      } else {
        return res.status(400).json({ success: false, message: "Tipo inválido. Use 'entrada' ou 'saida'." });
      }
    } else {
      return res.status(400).json({ success: false, message: "golaPunho deve ser 'gola' ou 'punho'." });
    }

    return res.status(200).json({ success: true, message: 'Entrada/saída registrada com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erro ao processar a requisição.' });
  }
});

// Removido prisma.$connect() explícito, pois o Prisma gerencia isso automaticamente no Vercel

// Exportar o app para o Vercel
export default app;