import './styles.css';
import google from '../../assets/images/google-logo.png';
import { useRegisterController } from './indexController';

const Register = () => {
    const {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        role,
        setRole,
        isLoading,
        handleSubmit,
        errors,
        handleLoginClick,
        ROLE_OPTIONS,
        handleGoogleRegister
    } = useRegisterController();

    return (
        <div className="register-page">
            <div className="register-wrapper">
                <div className="register-form-container">
                    <form className="register-form" onSubmit={handleSubmit}>
                        <h2 className="form-title">REGISTRE-SE</h2>

                        <div className="form-row">
                            <div className="input-group full-width">
                                <label htmlFor="name">Nome Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Digite seu nome completo"
                                    required
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite seu email"
                                    required
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="role">Como prefere usar o CertifAI?</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className={errors.role ? 'error' : ''}
                                    aria-invalid={errors.role ? 'true' : 'false'}
                                    aria-describedby={errors.role ? 'role-error' : undefined}
                                    required
                                >
                                    <option value="">Selecione seu perfil</option>
                                    {ROLE_OPTIONS.map((option: {value: string, label: string}) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <span id="role-error" className="error-message">{errors.role}</span>}
                            </div>  
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="password">Senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    required
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="confirmPassword">Confirmar Senha</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme sua senha"
                                    required
                                />
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>
                        </div>

                        <div className="register-buttons-container">
                            <button type="submit" className="register-button" disabled={isLoading}>
                                {isLoading ? 'REGISTRANDO...' : 'REGISTRAR'}
                            </button>

                            <div className="divider-vertical">
                                <span>ou</span>
                            </div>

                            <button
                                onClick={handleGoogleRegister}
                                className="google-login-button"
                                disabled={isLoading}>
                                 <img
                                    src={google} 
                                    alt="Google logo"
                                    className="w-3 h-3"
                                />
                                <span className="text-sm font-medium text-gray-700">Entrar com Google</span>
                            </button>
                        </div>

                        {Object.values(errors).some(error => error) && (
                            <div className="error-message">
                                <p>{Object.values(errors).find(error => error) || 'Verifique os campos e tente novamente'}</p>
                            </div>
                        )}
                        
                        <div className="login-section">
                            <p className="login-text">Já tem uma conta?</p>
                            <button type="button" className="login-link-button" onClick={handleLoginClick}>
                                FAZER LOGIN
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;