import React from 'react';
import { useParams } from 'react-router-dom';
import { useSimulationController } from './indexController.tsx';
import './styles.css';

const SimulationPage: React.FC = () => {
    const { provaId } = useParams<{ provaId: string }>(); // Obtém o provaId da rota
    const {
        state,
        currentQuestion,
        handleSelectAlternative,
        handleNext,
        handleRestart,
        handleFinish,
        getScore,
        questions,
        loading
    } = useSimulationController(Number(provaId)); // Converte provaId para número

    if (loading || questions.length === 0) {
        return (
            <div className="tests-simulation-container">
                <div className="tests-simulation-result">
                    <h2>Carregando simulação...</h2>
                </div>
            </div>
        );
    }

    if (state.finished) {
        return (
            <div className="tests-simulation-container">
                <div className="tests-simulation-result">
                    <h2>Simulação finalizada!</h2>
                    <p>Você acertou {getScore()} de {questions.length} questões.</p>
                    <button className="tests-simulation-restart-btn" onClick={handleRestart}>
                        Refazer simulação
                    </button>
                    <button className="tests-simulation-next-btn" onClick={handleFinish}>
                        Finalizar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="tests-simulation-container simulation-layout">
            <div className="simulation-left">
                <div className="tests-simulation-question-card">
                    <h2 className="tests-simulation-question-title">
                        Questão {state.currentIndex + 1} de {questions.length}
                    </h2>
                    <p className="tests-simulation-question-enunciado">{currentQuestion?.enunciado}</p>
                    <div className="tests-simulation-alternativas-list">
                        {currentQuestion?.alternativas.map(alt => (
                            <button
                                key={alt.id}
                                className={`tests-simulation-alternativa-btn${state.answers[currentQuestion.id] === alt.id ? ' selected' : ''}`}
                                onClick={() => handleSelectAlternative(alt.id)}
                            >
                                {alt.texto}
                            </button>
                        ))}
                    </div>
                    <div className="tests-simulation-actions">
                        <button
                            className="tests-simulation-next-btn"
                            onClick={handleNext}
                            disabled={state.answers[currentQuestion?.id] == null}
                        >
                            {state.currentIndex < questions.length - 1 ? 'Próxima' : 'Finalizar'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="simulation-right">
                <div className="simulation-questions-nav">
                    <span className="simulation-questions-nav-title">Questões</span>
                    <div className="simulation-questions-nav-list">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                className={`simulation-question-nav-btn${state.currentIndex === idx ? ' active' : ''}${state.answers[q.id] != null ? ' answered' : ''}`}
                                onClick={() => {
                                    if (!state.finished) {
                                        // Navega para questão
                                    }
                                }}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulationPage;
