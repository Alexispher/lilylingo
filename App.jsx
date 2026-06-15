import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Heart,
  AlertTriangle,
  Info,
  Flame
} from 'lucide-react';

// Todo o banco de questões extraído estritamente do U3.pdf
const ALL_QUESTIONS = [
  {
    id: 1,
    topic: "Função Massa de Probabilidade (PMF)",
    question: "Uma API recebe X tickets urgentes por hora. As probabilidades são P(0)=0.40, P(1)=0.35, P(2)=0.20. Qual deve ser o valor de P(3) para que essa distribuição seja válida?",
    options: ["0.05", "0.15", "0.10", "1.00"],
    correct: 0,
    rationale: "Toda PMF deve somar exatamente 1. 0.40 + 0.35 + 0.20 = 0.95. Logo, 1 - 0.95 = 0.05.",
    hint: "Lembre-se da regra de ouro: A soma de todas as probabilidades possíveis tem que ser igual a 1."
  },
  {
    id: 2,
    topic: "Esperança Matemática",
    question: "Usando os dados da API: 0(0.40), 1(0.35), 2(0.20) e 3(0.05). Qual é a média esperada E(X) de tickets urgentes por hora?",
    options: ["0.75", "0.90", "1.60", "1.00"],
    correct: 1,
    rationale: "E(X) = (0 * 0.40) + (1 * 0.35) + (2 * 0.20) + (3 * 0.05) = 0 + 0.35 + 0.40 + 0.15 = 0.90 tickets/hora.",
    hint: "A esperança é a soma de cada valor multiplicado pela sua probabilidade."
  },
  {
    id: 3,
    topic: "Variância",
    question: "A variância mede o quê em relação à distribuição dos dados?",
    options: [
      "A soma de todas as probabilidades.",
      "A dispersão dos valores em relação ao centro (média) da distribuição.",
      "A probabilidade do evento de maior sucesso.",
      "A diferença entre o maior e o menor erro."
    ],
    correct: 1,
    rationale: "Var(X) mede o espalhamento (dispersão) dos dados em torno da média esperada E(X).",
    hint: "Pense em quão 'espalhados' ou 'concentrados' os valores estão."
  },
  
  {
    id: 4,
    topic: "Distribuição Binomial",
    question: "Um classificador acerta com probabilidade p=0.80. Em 6 previsões independentes (n=6), como calcular a probabilidade de EXATAMENTE 5 acertos?",
    options: [
      "P(X=5) = 6 * 0.80 * 0.20",
      "P(X=5) = C(6,5) * 0.80^5 * 0.20^1",
      "P(X=5) = 0.80^5",
      "P(X=5) = C(6,5) * 0.20^5 * 0.80^1"
    ],
    correct: 1,
    rationale: "Fórmula Binomial: P(X=k) = C(n,k) * p^k * (1-p)^(n-k). Sucesso p=0.80 (elevado a 5), fracasso 1-p=0.20 (elevado a 1).",
    hint: "Você precisa combinar os sucessos C(n,k) e multiplicar pelas chances de sucesso e fracasso."
  },
  {
    id: 5,
    topic: "Distribuição de Poisson",
    question: "Uma fila recebe em média 4 jobs por minuto (λ = 4). Se você quiser calcular a probabilidade de receber 0 jobs em 30 segundos, qual valor de λ deve usar?",
    options: ["λ = 4", "λ = 8", "λ = 2", "λ = 0.5"],
    correct: 2,
    rationale: "Se o intervalo de tempo cai pela metade (de 1 min para 30 seg), a taxa média λ também cai pela metade. 4 * 0.5 = 2.",
    hint: "Ajuste a taxa λ proporcionalmente ao novo intervalo de tempo. Nunca misture minuto com segundo!"
  },
  {
    id: 6,
    topic: "Distribuição Normal (Z-score)",
    question: "A latência de uma API tem média μ=120ms e desvio-padrão σ=20ms. Qual é o escore-z de uma requisição com 170ms?",
    options: ["1.5", "2.5", "3.0", "50"],
    correct: 1,
    rationale: "z = (x - μ) / σ -> (170 - 120) / 20 = 50 / 20 = 2.5 desvios-padrão acima da média.",
    hint: "Z é a distância do valor até a média, dividida pelo desvio-padrão."
  },
  
  {
    id: 7,
    topic: "Teorema Central do Limite (TCL)",
    question: "O que o Teorema Central do Limite afirma sobre as médias amostrais?",
    options: [
      "Que amostras grandes corrigem coleta enviesada.",
      "Que a média da amostra sempre será igual à variância.",
      "Mesmo que a população original não seja Normal, a distribuição das médias amostrais se aproxima da Normal para n grande.",
      "Que o desvio-padrão aumenta conforme o tamanho da amostra (n) aumenta."
    ],
    correct: 2,
    rationale: "O TCL é a magia da estatística: independentemente da forma original, as médias de amostras grandes sempre convergem para uma curva Normal.",
    hint: "Por que a curva de sino (Normal) aparece em tudo? Tem a ver com amostras grandes..."
  },
  {
    id: 8,
    topic: "Erro-Padrão (EP)",
    question: "O tempo de resposta tem um desvio-padrão σ=120ms. Se coletarmos uma amostra de n=36 requisições, qual é o erro-padrão da média?",
    options: ["120 ms", "3.33 ms", "20 ms", "6 ms"],
    correct: 2,
    rationale: "A fórmula do Erro-Padrão é EP = σ / √n. Então: 120 / √36 = 120 / 6 = 20 ms.",
    hint: "Divida o desvio-padrão pela raiz quadrada do tamanho da amostra (n)."
  },
  {
    id: 9,
    topic: "Intervalo de Confiança (IC)",
    question: "Você gerou um IC de 95% para o tempo médio de resposta: [230.2, 249.8] ms. O que isso significa?",
    options: [
      "Há 95% de chance de o tempo médio da próxima requisição cair aí dentro.",
      "95% de todos os tempos de resposta do servidor estão nesse intervalo.",
      "O método usado captura a média real em cerca de 95% das amostras repetidas.",
      "O servidor nunca passará de 249.8 ms em 95% dos dias."
    ],
    correct: 2,
    rationale: "IC fala sobre a confiabilidade do MÉTODO, não sobre um parâmetro aleatório ou sobre os dados individuais. Não use a frase '95% de chance da média estar ali'.",
    hint: "Cuidado! O IC avalia o método de amostragem, não os dados isolados."
  },
  {
    id: 10,
    topic: "Correlação de Pearson",
    question: "O cálculo de correlação entre 'Usuários ativos (X)' e 'Latência média (Y)' resultou em r = 0.82. O que isso indica?",
    options: [
      "Associação linear positiva forte: mais usuários tendem a maior latência.",
      "Associação fraca e muita dispersão de dados.",
      "Causalidade comprovada: os usuários são a única causa da lentidão.",
      "Relação decrescente: latência cai quando usuários aumentam."
    ],
    correct: 0,
    rationale: "Um r=0.82 é próximo de +1, indicando tendência positiva e forte. Mas ATENÇÃO: correlação NÃO implica causalidade automática.",
    hint: "Olhe para o sinal (positivo) e para a magnitude (perto de 1 é forte)."
  },
  {
    id: 11,
    topic: "Causalidade x Correlação",
    question: "Se r=0.90 entre duas variáveis de um sistema, podemos afirmar causalidade com base apenas nisso?",
    options: [
      "Sim, r > 0.8 já comprova causalidade.",
      "Não, pois pode haver uma variável de confusão influenciando ambas (ex: pico de horário ou deploy recente).",
      "Sim, desde que a amostra seja maior que 30.",
      "Não, pois r deveria ser exatamente 1.00 para provar causalidade."
    ],
    correct: 1,
    rationale: "Correlação não é causalidade. Você precisa de experimentos controlados ou ordem temporal para provar causa e efeito.",
    hint: "Duas coisas crescerem juntas não significa que uma puxa a outra. Pode ter um terceiro elemento na história."
  },
  {
    id: 12,
    topic: "Regra Empírica (Curva Normal)",
    question: "Pela regra empírica da Normal, aproximadamente qual porcentagem dos dados fica a 2 desvios-padrão (±2σ) de distância da média?",
    options: ["68%", "95%", "99.7%", "50%"],
    correct: 1,
    rationale: "Regra empírica: ±1σ = ~68%, ±2σ = ~95%, ±3σ = ~99.7%. O slide do professor cobra isso (95.44% exato, ou 95% prático).",
    hint: "Lembre do gráfico em sino. ±1 desvio é a maioria simples, ±2 desvios abrange a grande maioria."
  }
];

// Componente do Avatar da Lily (Inspirada na Ada Wong)
const LilyAvatar = ({ mood }) => {
  const getStyle = () => {
    switch(mood) {
      case 'happy': return 'bg-green-600 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]';
      case 'angry': return 'bg-red-700 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]';
      case 'thinking': return 'bg-red-900 border-red-700'; // Vermelho fechado
      default: return 'bg-zinc-800 border-zinc-700';
    }
  };

  const getFace = () => {
    switch(mood) {
      case 'happy': return '( ⌐■_■)'; // Óculos escuros
      case 'angry': return '( ಠ_ಠ )'; // Julgando
      case 'thinking': return '( ¬_¬)'; // Olhar pragmático
      default: return '( •_•)';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-white text-2xl font-black transition-all duration-300 ${getStyle()}`}>
        {getFace()}
      </div>
      <span className="text-xs font-bold mt-2 text-zinc-400 uppercase tracking-widest">Lily</span>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mood, setMood] = useState('thinking');
  const [quizSet, setQuizSet] = useState(ALL_QUESTIONS);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const currentQuestion = quizSet[currentIndex];

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const correct = index === currentQuestion.correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      setMood('happy');
    } else {
      setHearts(h => Math.max(0, h - 1));
      if (!isReviewMode) {
        // Se já não estiver na revisão, guarda para a prova dos erros
        setWrongAnswers(prev => {
          if (!prev.find(p => p.id === currentQuestion.id)) {
            return [...prev, currentQuestion];
          }
          return prev;
        });
      }
      setMood('angry');
    }
  };

  const nextQuestion = () => {
    if (currentIndex < quizSet.length - 1) {
      setCurrentIndex(c => c + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setMood('thinking');
    } else {
      setStep('results');
    }
  };

  const startErrorReview = () => {
    if (wrongAnswers.length === 0) return;
    
    // Altera o contexto da pergunta para forçar a atenção
    const reviewSet = wrongAnswers.map(q => ({
      ...q,
      question: `[MISSÃO DE RESGATE] Você errou isso antes. Pense rápido: ${q.question}`,
      topic: `🔥 REFORÇO: ${q.topic}`
    }));
    
    setQuizSet(reviewSet);
    setWrongAnswers([]);
    setCurrentIndex(0);
    setScore(0);
    setHearts(5);
    setIsAnswered(false);
    setSelectedOption(null);
    setStep('quiz');
    setMood('thinking');
    setIsReviewMode(true);
  };

  const resetAll = () => {
    setQuizSet(ALL_QUESTIONS);
    setWrongAnswers([]);
    setCurrentIndex(0);
    setScore(0);
    setHearts(5);
    setStep('intro');
    setIsReviewMode(false);
    setMood('thinking');
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans text-zinc-100">
        <div className="max-w-md w-full bg-zinc-900 border border-red-900/30 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          {/* Decoração de fundo */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>
          
          <LilyAvatar mood="thinking" />
          
          <h1 className="text-3xl font-black mt-6 mb-2">Simulador CC3M</h1>
          <p className="text-red-400 font-bold mb-4 uppercase tracking-wider text-sm">Operação: Sobrevivência</p>
          
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Olá. Sou a Lily. Vesti vermelho hoje porque a missão é crítica. O professor Eli Helberth não perdoa no exame. 
            Você tem <strong>5 corações</strong>. Se zerar, é bom orar para Deus, porque meu treinamento vai acabar.
          </p>
          
          <button 
            onClick={() => setStep('quiz')}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-900/50 flex items-center justify-center gap-2"
          >
            <Flame size={20} /> INICIAR TREINAMENTO
          </button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const isPerfect = score === quizSet.length;
    
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans text-zinc-100">
        <div className="max-w-md w-full bg-zinc-900 p-8 rounded-3xl shadow-2xl text-center">
          <LilyAvatar mood={isPerfect ? 'happy' : 'thinking'} />
          
          <h2 className="text-3xl font-black mt-6 mb-2">Relatório de Missão</h2>
          <div className="flex justify-center gap-4 my-6">
            <div className="bg-zinc-800 p-4 rounded-2xl w-24">
              <span className="block text-3xl font-black text-green-500">{score}</span>
              <span className="text-xs text-zinc-400 uppercase font-bold">Acertos</span>
            </div>
            <div className="bg-zinc-800 p-4 rounded-2xl w-24">
              <span className="block text-3xl font-black text-red-500">{quizSet.length - score}</span>
              <span className="text-xs text-zinc-400 uppercase font-bold">Erros</span>
            </div>
          </div>

          {wrongAnswers.length > 0 ? (
            <div className="mt-4">
              <p className="text-zinc-400 mb-6">Eu anotei suas falhas. Na hora da prova, o Eli Helberth vai cobrar justo o que você errou aqui. Pratique de novo.</p>
              <button 
                onClick={startErrorReview}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-2xl mb-4 transition-all shadow-lg flex justify-center items-center gap-2"
              >
                <Flame size={20} /> PROVA DOS ERROS
              </button>
            </div>
          ) : (
            <div className="mt-4 bg-green-500/10 border border-green-500/30 p-4 rounded-2xl mb-6">
              <p className="text-green-400 font-bold">Trabalho impecável. Você está pronto. Vá com Deus e amasse nessa prova amanhã!</p>
            </div>
          )}
          
          <button 
            onClick={resetAll}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2"
          >
            <RotateCcw size={18} /> Tentar tudo novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100 max-w-2xl mx-auto md:py-8 shadow-2xl relative overflow-hidden">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 mb-4">
        <div className="flex-1 mr-4 bg-zinc-800 h-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex) / quizSet.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 font-black text-red-500 text-xl">
          <Heart fill="currentColor" size={24} className={hearts === 1 ? 'animate-pulse' : ''} /> {hearts}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4">
        
        {/* Pergunta / Chat Bubble */}
        <div className="flex gap-4 mb-8 items-start">
          <LilyAvatar mood={mood} />
          <div className="relative bg-zinc-800 p-5 rounded-3xl rounded-tl-none flex-1 shadow-lg border border-zinc-700">
             <div className="absolute -left-3 top-0 w-0 h-0 border-t-[15px] border-t-zinc-800 border-l-[15px] border-l-transparent"></div>
             <p className="text-xs font-black text-red-400 uppercase mb-2 tracking-wider">{currentQuestion.topic}</p>
             <p className="text-[17px] leading-relaxed font-medium">{currentQuestion.question}</p>
          </div>
        </div>

        {/* Opções */}
        <div className="space-y-3 pb-24">
          {currentQuestion.options.map((opt, i) => {
            let style = "border-zinc-700 bg-zinc-900 hover:bg-zinc-800";
            if (isAnswered) {
              if (i === currentQuestion.correct) {
                style = "border-green-500 bg-green-500/20 text-green-300";
              } else if (i === selectedOption) {
                style = "border-red-500 bg-red-500/20 text-red-300";
              } else {
                style = "border-zinc-800 bg-zinc-900/50 opacity-40";
              }
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleAnswer(i)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all duration-200 ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar (Aparece ao responder) */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 border-t transition-all duration-300 transform md:max-w-2xl md:mx-auto md:rounded-t-3xl ${
        isAnswered 
          ? (isCorrect ? 'bg-zinc-900 border-green-900/50' : 'bg-zinc-900 border-red-900/50') 
          : 'translate-y-full bg-zinc-900 border-zinc-800'
      }`}>
        
        {isAnswered && (
          <div className="mb-4 max-h-40 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? <CheckCircle2 className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
              <span className={`font-black text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? 'Exato.' : 'Você está me testando? Errado.'}
              </span>
            </div>
            <p className="text-sm text-zinc-300 bg-zinc-800 p-3 rounded-xl border border-zinc-700">
              <span className="font-bold text-white block mb-1">Motivo:</span> 
              {currentQuestion.rationale}
            </p>
          </div>
        )}

        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
            isAnswered 
              ? (isCorrect ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-700 hover:bg-red-600 text-white') 
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed hidden'
          }`}
        >
          CONTINUAR <ArrowRight size={20} />
        </button>
      </div>

      {/* Dica visível apenas ANTES de responder */}
      {!isAnswered && (
        <div className="fixed bottom-4 left-4 right-4 md:max-w-[calc(672px-2rem)] md:mx-auto">
           <div className="flex items-start gap-3 text-zinc-400 bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-zinc-800 shadow-xl">
             <Info size={20} className="shrink-0 text-red-500 mt-0.5" />
             <p className="text-sm font-medium leading-relaxed">
               <span className="font-bold text-white mr-1">Dica:</span>
               {currentQuestion.hint}
             </p>
           </div>
        </div>
      )}

      {/* Game Over Screen */}
      {hearts === 0 && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-6 z-50">
          <AlertTriangle className="w-24 h-24 text-red-600 mb-6 animate-bounce" />
          <h2 className="text-4xl font-black text-white mb-2 text-center uppercase">Missão Falhou</h2>
          <p className="text-zinc-400 text-center mb-8 max-w-sm text-lg">
            Corações zerados. A Lily avisou. Desse jeito você vai ter que ajoelhar e orar antes da prova do Eli Helberth. 
          </p>
          <button 
            onClick={resetAll}
            className="w-full max-w-xs bg-white text-black hover:bg-zinc-200 font-black py-4 rounded-2xl transition-all transform hover:scale-105 flex justify-center items-center gap-2"
          >
            <RotateCcw size={20} /> COMEÇAR DE NOVO
          </button>
        </div>
      )}
    </div>
  );
}
