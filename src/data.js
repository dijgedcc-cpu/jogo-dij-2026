export const gameData = {
  // Each case has multiple action options. Each option maps to a character + skill
  // and has a "quality" rating: "best", "good", or "poor" determining outcome.
  cases: [
    {
      id: 1,
      title: "O Bullying",
      icon: "😢",
      description: "No grupo de WhatsApp da escola e nos corredores, começou a rolar uma brincadeira sem graça com o Lucas, um aluno novo que é mais quieto e usa óculos com armação antiga. Criaram um apelido maldoso e começaram a postar memes editados para zombar do jeito dele falar. A turma toda ri para não ficar de fora, e alguns até repassam as fotos. Lucas tem chegado calado em casa, com a nota caindo e inventando desculpas para não ir à aula.",
      actions: [
        {
          characterId: "graca",
          label: "Acolher Lucas com Colo Espiritual",
          description: "Deusa-Irmã Graça envolve Lucas em uma energia de amor incondicional, curando a dor emocional e restaurando sua autoestima.",
          quality: "best",
          resultText: "O Colo Espiritual de Graça envolveu Lucas, que finalmente se sentiu visto e amado. A dor do bullying começou a cicatrizar e ele encontrou coragem para pedir ajuda aos professores. A turma, tocada pela vibração do amor, parou com as piadas."
        },
        {
          characterId: "jam",
          label: "Usar Ressonância do 5º Chakra para confrontar os agressores",
          description: "Jam usa sua voz de autoridade amorosa para pacificar o conflito e fazer os agressores refletirem.",
          quality: "good",
          resultText: "A voz potente de Jam ressoou pelos corredores. Os agressores pararam, surpresos com a autoridade daquela fala cheia de amor. Nem todos mudaram de imediato, mas a maioria se envergonhou e parou de repassar os memes."
        },
        {
          characterId: "august",
          label: "Confrontar com A Voz da Verdade",
          description: "August questiona publicamente a injustiça, desarmando os argumentos dos agressores com lógica e empatia.",
          quality: "good",
          resultText: "August fez perguntas diretas e justas: 'E se fosse com você? Você acharia engraçado?'. Os questionamentos desarmaram os líderes do bullying, que ficaram sem resposta. O clima começou a mudar."
        },
        {
          characterId: "deby",
          label: "Tentar animar Lucas com Explosão de Alegria",
          description: "Deby Chispas tenta limpar o ambiente negativo usando alta vibração e entusiasmo.",
          quality: "poor",
          resultText: "Embora a Explosão de Alegria de Deby tenha aliviado a tensão momentaneamente, Lucas ainda precisava de acolhimento profundo. A alegria sozinha não tratou a raiz do problema. Deby sentiu o peso da fadiga espiritual."
        }
      ]
    },
    {
      id: 2,
      title: "Em Casa",
      icon: "🏠",
      description: "Na casa de Beatriz (14 anos), o clima andava pesado há semanas. Sempre que ela chega da escola, vai direto para o quarto, joga a mochila no chão, liga o fone de ouvido e fica horas no celular. Os pais reclamam que ela não conversa. Beatriz sente que os pais só sabem cobrar notas e criticar. Em um sábado, após um pedido simples para arrumar o quarto virar uma discussão com gritos e portas batidas, o clima fica insustentável.",
      actions: [
        {
          characterId: "ale_aly",
          label: "Mediar com O Abraço da Ternura",
          description: "Alê & Aly neutralizam a ansiedade e criam um espaço seguro para o diálogo entre Beatriz e seus pais.",
          quality: "best",
          resultText: "O Abraço da Ternura de Alê & Aly envolveu a casa de Beatriz em uma energia de paz. A ansiedade se dissipou e, pela primeira vez em semanas, Beatriz e seus pais conseguiram conversar sem gritos. Lágrimas de reconciliação rolaram."
        },
        {
          characterId: "violeiro",
          label: "Harmonizar com Acorde da Elevação",
          description: "O Violeiro Harmônico limpa o campo áurico da casa, dissipando a raiva e a ansiedade acumuladas.",
          quality: "good",
          resultText: "As notas do Violeiro preencheram a casa com uma vibração serena. A raiva que impregnava as paredes começou a se dissipar. Os pais de Beatriz respiraram fundo e ela sentiu vontade de sair do quarto."
        },
        {
          characterId: "graca",
          label: "Intuição da Necessidade para revelar o que falta",
          description: "Deusa-Irmã Graça usa sua intuição para revelar os pontos cegos de ambos os lados: Beatriz e seus pais.",
          quality: "good",
          resultText: "Graça revelou ao grupo que Beatriz estava sofrendo pressão dos amigos na escola e os pais não sabiam. Ao mesmo tempo, mostrou que os pais só queriam protegê-la. A compreensão mútua começou a brotar."
        },
        {
          characterId: "jam",
          label: "Comandar uma reunião familiar com Superforça Vital",
          description: "Jam tenta forçar uma conversa usando a autoridade da sua voz e energia vital.",
          quality: "poor",
          resultText: "A energia intensa de Jam assustou tanto Beatriz quanto seus pais. Forçar a conversa gerou mais resistência. Jam sentiu a Afonia do Esgotamento — às vezes a força bruta não resolve conflitos familiares delicados."
        }
      ]
    },
    {
      id: 3,
      title: "O Pávio Curto no Intervalo",
      icon: "⚽",
      description: "Durante um jogo de futebol no intervalo, a disputa pela bola ficou acirrada. Cauã passou a bola com força excessiva, quase machucando Enzo. Enzo partiu para cima com gritos e empurrões. Uma roda de alunos se formou, alguns incentivando a briga. O professor separou a dupla, mas a energia de raiva continuou vibrando forte.",
      actions: [
        {
          characterId: "violeiro",
          label: "Acorde da Elevação para dissipar a raiva",
          description: "O Violeiro Harmônico toca um acorde que limpa toda a energia de raiva e agressividade do ambiente.",
          quality: "best",
          resultText: "O acorde do Violeiro cortou a tensão como um raio de luz. A raiva que alimentava Cauã e Enzo simplesmente se evaporou. Os dois se olharam confusos, como se tivessem acordado de um transe. A roda se dispersou em paz."
        },
        {
          characterId: "jam",
          label: "Ressonância do 5º Chakra para impor autoridade",
          description: "Jam usa sua voz poderosa para interromper a escalada de violência com autoridade amorosa.",
          quality: "good",
          resultText: "A voz de Jam ressoou com tanta força e amor que os dois pararam na hora. 'Vocês são mais fortes que essa raiva!' — a frase ecoou. Cauã pediu desculpas primeiro, quebrando o orgulho."
        },
        {
          characterId: "mary",
          label: "Construir uma ponte entre os dois com As Mãos Construtoras",
          description: "Mary materializa uma solução prática, organizando um novo jogo onde ambos precisam cooperar.",
          quality: "good",
          resultText: "Mary rapidamente organizou um desafio onde Cauã e Enzo precisavam jogar no mesmo time. A competição transformou-se em cooperação. No final, os dois se cumprimentaram com respeito."
        },
        {
          characterId: "luciano",
          label: "Usar Gambiarra Divina para criar uma distração",
          description: "Brady constrói algo inesperado para desviar a atenção dos dois e quebrar o ciclo de agressão.",
          quality: "poor",
          resultText: "A Gambiarra de Brady chamou atenção momentaneamente, mas não tratou a raiz da raiva. Cauã e Enzo continuaram se encarando à distância. Brady sentiu a Sobrecarga Mental — a engenharia sozinha não resolve emoções."
        }
      ]
    },
    {
      id: 4,
      title: "O Comentário Nada Inocente",
      icon: "💔",
      description: "Durante um trabalho em grupo na escola, Mariana (uma garota negra de 13 anos) sugeriu uma ideia inovadora. Um colega soltou: 'Nossa, Mariana, até que para o seu tipo de cabelo e estilo, você pensou bem rápido, né?'. Alguns riram, mas Mariana travou, sentiu o rosto esquentar de vergonha e frustração, e ficou em silêncio o resto do trabalho.",
      actions: [
        {
          characterId: "jess",
          label: "Vento do Movimento para ajustar a injustiça",
          description: "Jess intervém com velocidade e precisão, nomeando o racismo e protegendo Mariana.",
          quality: "best",
          resultText: "Jess agiu rapidamente: nomeou o preconceito sem rodeios, acolheu Mariana e fez o colega entender o peso das suas palavras. A turma inteira aprendeu uma lição sobre racismo estrutural. Mariana voltou a sorrir, sentindo-se protegida."
        },
        {
          characterId: "august",
          label: "A Voz da Verdade para desarmar o preconceito",
          description: "August questiona o colega com perguntas certeiras que expõem o racismo velado.",
          quality: "good",
          resultText: "August olhou firme e perguntou: 'O que o cabelo dela tem a ver com a inteligência dela?' O silêncio foi ensurdecedor. O colega ficou vermelho, sem resposta. A turma percebeu a gravidade do que foi dito."
        },
        {
          characterId: "graca",
          label: "Colo Espiritual para acolher Mariana",
          description: "Deusa-Irmã Graça acolhe Mariana emocionalmente, curando a ferida do preconceito.",
          quality: "good",
          resultText: "Graça envolveu Mariana em luz e calor. 'Sua ideia foi brilhante, Mariana. Você é brilhante.' As palavras foram bálsamo. Mariana sentiu as lágrimas secarem e a força voltar. Mas o colega agressor não foi confrontado."
        },
        {
          characterId: "deby",
          label: "Explosão de Alegria para mudar o clima",
          description: "Deby tenta transformar o ambiente pesado em algo leve e positivo.",
          quality: "poor",
          resultText: "A Explosão de Alegria de Deby deixou a sala mais leve, mas invisibilizou a dor de Mariana. Fazer de conta que está tudo bem quando alguém sofreu racismo é perigoso. Deby sentiu o peso de ter errado a abordagem."
        }
      ]
    },
    {
      id: 5,
      title: "O Limite Desrespeitado",
      icon: "🛡️",
      description: "Nas últimas semanas, João percebeu que um veterano da escola começou a persegui-lo nas redes sociais com mensagens insistentes e comentários invasivos. Nos corredores, esse aluno faz brincadeiras constrangedoras para intimidá-lo. João sente uma angústia enorme toda vez que se aproxima do horário de ir para a escola, mas tem medo de contar.",
      actions: [
        {
          characterId: "mary",
          label: "As Mãos Construtoras para criar um caminho seguro",
          description: "Mary constrói uma ponte de confiança para João e materializa uma rede de apoio com adultos responsáveis.",
          quality: "best",
          resultText: "Mary construiu pacientemente uma rede de proteção: conectou João a um professor de confiança, ajudou-o a salvar as provas das mensagens e organizou um encontro seguro onde ele pôde contar tudo. O veterano foi confrontado pela escola com justiça."
        },
        {
          characterId: "jess",
          label: "Vento do Movimento para intervir rapidamente",
          description: "Jess ajusta a situação injusta com velocidade, confrontando o agressor e protegendo João.",
          quality: "good",
          resultText: "Jess interceptou o veterano no corredor com firmeza: 'Isso acaba agora.' A velocidade e determinação de Jess assustaram o agressor. João ganhou fôlego, mas o problema precisaria de acompanhamento a longo prazo."
        },
        {
          characterId: "ale_aly",
          label: "O Abraço da Ternura para acalmar João",
          description: "Alê & Aly neutralizam a ansiedade de João e criam um espaço seguro para ele se abrir.",
          quality: "good",
          resultText: "A ternura de Alê & Aly fez João chorar de alívio. Pela primeira vez ele sentiu que podia confiar em alguém. O abraço não resolveu o problema do agressor, mas deu a João a coragem que faltava para buscar ajuda."
        },
        {
          characterId: "luciano",
          label: "Gambiarra Divina para bloquear o agressor digitalmente",
          description: "Brady tenta usar sua engenharia para bloquear e rastrear as mensagens do agressor.",
          quality: "poor",
          resultText: "A Gambiarra de Brady bloqueou temporariamente as mensagens, mas o agressor encontrou outros caminhos. Soluções técnicas sozinhas não protegem quem sofre assédio — é preciso intervenção humana. Brady sentiu a Sobrecarga Mental."
        }
      ]
    }
  ],
  characters: [
    {
      id: "graca",
      name: "Deusa-Irmã Graça",
      emoji: "🌸",
      avatar: "/characters/graca.png",
      cardImage: "/characters/graca_card.png",
      color: "#f472b6",
      archetype: "A Matriarca do Amor Divino",
      role: "Acolhimento Intuitivo e Regeneração de Propósito",
      skills: [
        { name: "Colo Espiritual", description: "Cura dores emocionais e renova o ânimo." },
        { name: "Intuição da Necessidade", description: "Revela pontos cegos indicando onde enviar ajuda." },
        { name: "Semente da Transformação", description: "Desperta potencial criativo e vontade de mudança." }
      ],
      fatigue: "Silêncio Doloroso — Diminuição da Luz e Bloqueio Intuitivo"
    },
    {
      id: "luciano",
      name: "Brady",
      emoji: "⚙️",
      avatar: "/characters/luciano.png",
      cardImage: "/characters/luciano_card.jpg",
      color: "#60a5fa",
      archetype: "O Galã Visionário / Inventor Espiritual",
      role: "Construtor de Soluções e Suporte Tático",
      skills: [
        { name: "Gambiarra Divina", description: "Constrói utilidades instantâneas para obstáculos." },
        { name: "Conexão com o Além", description: "Consulta o plano espiritual para rerrolar dado." }
      ],
      fatigue: "Sobrecarga Mental — Estado de Confusão e ferramentas com defeito"
    },
    {
      id: "jam",
      name: "Jam",
      emoji: "🎤",
      avatar: "/characters/jam.png",
      cardImage: "/characters/jam_card.png",
      color: "#34d399",
      archetype: "A Guardiã da Voz Fraterna",
      role: "Vanguarda Motivacional e Comando Tático",
      skills: [
        { name: "Ressonância do 5º Chakra", description: "Voz de autoridade amorosa que pacifica conflitos." },
        { name: "Superforça Vital", description: "Remove obstáculos ou ergue escudos protetores." },
        { name: "Pulso de Alegria", description: "Aura de entusiasmo expansivo contagiante." }
      ],
      fatigue: "Afonia e Esgotamento — Perda do Comando e do Impulso"
    },
    {
      id: "violeiro",
      name: "O Violeiro Harmônico",
      emoji: "🎸",
      avatar: "/characters/violeiro.png",
      cardImage: "/characters/violeiro_card.png",
      color: "#a78bfa",
      archetype: "O Filósofo Musical",
      role: "Suporte Vibracional e Orientação",
      skills: [
        { name: "Acorde da Elevação", description: "Limpa o campo áurico, dissipa raiva e ansiedade." },
        { name: "Melodia da Verdade", description: "Revela intenções ocultas através da música." }
      ],
      fatigue: "Dissonância Interna — Acordes desafinados e confusão mental"
    },
    {
      id: "jess",
      name: "Jess",
      emoji: "💨",
      avatar: "/characters/jess.png",
      cardImage: "/characters/jess_card.png",
      color: "#fb923c",
      archetype: "A Protetora da Justiça",
      role: "Cura de Campo e Resgate Astral",
      skills: [
        { name: "Vento do Movimento", description: "Ajusta situações injustas com velocidade." },
        { name: "Escudo de Empatia", description: "Proteção energética contra ataques emocionais." }
      ],
      fatigue: "Turbulência — Movimentos erráticos e perda de direção"
    },
    {
      id: "deby",
      name: "Deby Chispas",
      emoji: "✨",
      avatar: "/characters/deby.png",
      cardImage: "/characters/deby_card.png",
      color: "#facc15",
      archetype: "A Catalisadora de Alegria",
      role: "Transforma Ambiente por Alta Vibração",
      skills: [
        { name: "Explosão de Alegria", description: "Limpa miasmas densos e reduz estresse." },
        { name: "Faísca de Inspiração", description: "Acende a criatividade em momentos de bloqueio." }
      ],
      fatigue: "Burnout Vibracional — Alegria forçada que esgota a energia"
    },
    {
      id: "mary",
      name: "Mary",
      emoji: "🤲",
      avatar: "/characters/mary.png",
      cardImage: "/characters/mary_card.png",
      color: "#2dd4bf",
      archetype: "A Construtora da Fé",
      role: "Conexão Empática e Materialização",
      skills: [
        { name: "As Mãos Construtoras", description: "Materializa soluções e constrói pontes." },
        { name: "Toque de Fé", description: "Restaura a esperança em quem desistiu." }
      ],
      fatigue: "Mãos Vazias — Incapacidade temporária de construir soluções"
    },
    {
      id: "august",
      name: "August",
      emoji: "🏛️",
      avatar: "/characters/august.png",
      cardImage: "/characters/august_card.png",
      color: "#818cf8",
      archetype: "O Pilar de Sustentação",
      role: "Coesão de Grupo e Defesa Ativa",
      skills: [
        { name: "A Voz da Verdade", description: "Questionamentos que desarmam injustiças." },
        { name: "Pilar Inabalável", description: "Sustenta o grupo em momentos de crise." }
      ],
      fatigue: "Rachadura no Pilar — Dúvida interna que enfraquece a coesão"
    },
    {
      id: "ale_aly",
      name: "Alê & Aly",
      emoji: "🧚",
      avatar: "/characters/ale_aly.png",
      cardImage: "/characters/ale_aly_card.png",
      color: "#f9a8d4",
      archetype: "Fadinhas da Ternura",
      role: "Resolução de Enigmas e Mediação",
      skills: [
        { name: "O Abraço da Ternura", description: "Neutraliza ansiedade em momentos de tensão." },
        { name: "Sussurro da Compreensão", description: "Faz cada lado ouvir o outro com o coração." }
      ],
      fatigue: "Fragilidade Cristalina — Excesso de empatia que drena energia"
    }
  ]
};
