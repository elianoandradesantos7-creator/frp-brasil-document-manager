
import React, { useState } from 'react';
import { auth } from '../../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';

const LoginScreen: React.FC = () => {
    const [view, setView] = useState<'login' | 'signup' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged in App.tsx will handle the success state
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Por favor, insira seu nome.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });
            // onAuthStateChanged will now pick up the user with the correct display name
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Link para redefinição de senha enviado! Verifique seu e-mail.');
            setView('login');
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthError = (err: any) => {
        switch (err.code) {
            case 'auth/invalid-api-key':
                 setError('Configuração do Firebase inválida. Verifique se as credenciais em firebase.ts estão corretas.');
                 break;
            case 'auth/user-not-found':
                setError('Nenhum usuário encontrado com este e-mail.');
                break;
            case 'auth/wrong-password':
                setError('Senha incorreta. Por favor, tente novamente.');
                break;
            case 'auth/email-already-in-use':
                setError('Este e-mail já está em uso por outra conta.');
                break;
            case 'auth/weak-password':
                setError('A senha deve ter pelo menos 6 caracteres.');
                break;
            case 'auth/invalid-email':
                setError('O formato do e-mail é inválido.');
                break;
            default:
                setError('Ocorreu um erro. Por favor, tente novamente.');
                console.error("Auth Error:", err);
        }
    };
    
    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setError(null);
        setMessage(null);
    }

    const renderContent = () => {
        if (view === 'signup') {
            return (
                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-frp-brasil focus:border-frp-brasil" />
                    </div>
                    <div>
                        <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input id="email-signup" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-frp-brasil focus:border-frp-brasil" />
                    </div>
                    <div>
                        <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input id="password-signup" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-frp-brasil focus:border-frp-brasil" />
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frp-brasil hover:bg-frp-petroleo focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frp-brasil disabled:opacity-50">
                            {isLoading ? 'Criando...' : 'Criar Conta'}
                        </button>
                    </div>
                     <p className="text-sm text-center">
                        Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); resetForm(); }} className="font-medium text-frp-brasil hover:text-frp-petroleo">Entrar</a>
                    </p>
                </form>
            );
        }
        if (view === 'reset') {
            return (
                <form onSubmit={handlePasswordReset} className="space-y-6">
                    <p className="text-sm text-gray-600 text-center">Insira seu e-mail para receber um link de redefinição de senha.</p>
                    <div>
                        <label htmlFor="email-reset" className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input id="email-reset" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-frp-brasil focus:border-frp-brasil" />
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frp-brasil hover:bg-frp-petroleo focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frp-brasil disabled:opacity-50">
                           {isLoading ? 'Enviando...' : 'Enviar Link'}
                        </button>
                    </div>
                    <p className="text-sm text-center">
                        Lembrou a senha? <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); resetForm(); }} className="font-medium text-frp-brasil hover:text-frp-petroleo">Voltar ao Login</a>
                    </p>
                </form>
            );
        }
        return (
            <form onSubmit={handleLogin} className="space-y-6">
                 <div>
                    <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">E-mail</label>
                    <input id="email-login" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-frp-brasil focus:border-frp-brasil" />
                </div>
                <div>
                    <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">Senha</label>
                    <input id="password-login" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-frp-brasil focus:border-frp-brasil" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <a href="#" onClick={(e) => { e.preventDefault(); setView('reset'); resetForm(); }} className="font-medium text-frp-brasil hover:text-frp-petroleo">
                            Esqueceu a senha?
                        </a>
                    </div>
                </div>
                <div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frp-brasil hover:bg-frp-petroleo focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frp-brasil disabled:opacity-50">
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>
                <p className="text-sm text-center">
                    Não tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); setView('signup'); resetForm(); }} className="font-medium text-frp-brasil hover:text-frp-petroleo">Cadastre-se</a>
                </p>
            </form>
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <img src="https://www.frpbrasil.com/wp-content/uploads/2023/10/logo-frp-brasil-preto-1.png" alt="FRP Brasil Logo" className="w-48 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-frp-petroleo">Document Manager v4.0</h2>
                     <p className="mt-2 text-sm text-gray-600">
                        {view === 'login' && 'Acesse sua conta corporativa'}
                        {view === 'signup' && 'Crie uma nova conta'}
                        {view === 'reset' && 'Recupere seu acesso'}
                    </p>
                </div>

                {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                {message && <p className="text-sm text-center text-green-600 bg-green-50 p-3 rounded-md">{message}</p>}

                <div className="mt-8">
                   {renderContent()}
                </div>

                <div className="text-center text-sm text-gray-500 mt-10">
                    <a href="https://www.frpbrasil.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        www.frpbrasil.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;