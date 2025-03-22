import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors()); // Permite qualquer origem acessar o seu backend
app.use(express.json());

app.post("/login", async (req, res) => {
  const { nome, senha } = req.body;

  try {
      // Buscar usuário pelo nome
      const usuario = await prisma.usuarios.findUnique({
          where: { nome: nome }
      });

      // Se não encontrou o usuário, retorna erro
      if (!usuario) {
          return res.status(401).json({ autenticado: false, mensagem: "Usuário não encontrado" });
      }

      // Verificar se a senha corresponde
      if (usuario.senha !== senha) {
          return res.status(401).json({ autenticado: false, mensagem: "Senha incorreta" });
      }

      // Se tudo estiver correto, retorna sucesso
      res.status(200).json({ autenticado: true, mensagem: "Login bem-sucedido", usuario });

  } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      res.status(500).json({ autenticado: false, mensagem: "Erro no servidor" });
  }
});

app.post('/novousuario', async (req, res) => {
  const { nome, eadmin } = req.body;

  try {
    const novoUsuario = await prisma.usuarios.create({
      data: { // Corrigido: precisa do campo "data"
        nome: nome,
        Eadmin: eadmin 
      }
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Falha ao criar novo usuário:', error);
    res.status(500).json({ erro: "Erro ao criar usuário" }); // Retorna resposta de erro
  }
});

app.post('/polos', async (req, res) => {
  try {
    const { codigo, cor, gola, punho } = req.body;

    // Validação dos campos obrigatórios
    if (!codigo || !cor || !gola || !punho || !gola.quantidade || !punho.quantidade) {
      throw new Error('Todos os campos (codigo, cor, gola.quantidade, punho.quantidade) são obrigatórios');
    }

    // Criar o Polo com Gola e Punho
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

app.get('/select-func', async (req, res)=>{
  try{
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id:true,
        nome: true
      }
    })

    res.json(usuarios)
  } catch(error){
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ mensagem: "Erro ao buscar dados no banco de dados" });
  }
})

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Banco conectado!');
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
}

// startServer();

