
import React, { useState, useCallback } from 'react';
import { editImageWithGemini } from '../../services/geminiService';

const ImageEditorView: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setOriginalImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setEditedImage(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!originalImageFile || !prompt) {
            setError('Por favor, carregue uma imagem e insira um prompt.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const base64Data = originalImage?.split(',')[1];
            if (!base64Data) {
                throw new Error("Não foi possível processar a imagem.");
            }
            
            const resultBase64 = await editImageWithGemini(base64Data, originalImageFile.type, prompt);
            setEditedImage(`data:image/png;base64,${resultBase64}`);

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, originalImageFile, prompt]);

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-frp-petroleo">Image Editor com IA</h1>
                <p className="mt-2 text-gray-600">Edite imagens usando o poder do Gemini 2.5 Flash Image. Diga "Adicione um filtro retrô" ou "Remova a pessoa no fundo".</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls and Input Column */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">1. Carregue uma Imagem</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-frp-brasil hover:text-frp-petroleo focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-frp-brasil">
                                        <span>Carregar um arquivo</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                    <p className="pl-1">ou arraste e solte</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">2. Descreva a Edição</label>
                        <textarea
                            id="prompt"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-frp-brasil focus:ring-frp-brasil sm:text-sm"
                            placeholder="Ex: Adicione um chapéu de sol na pessoa"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !originalImage || !prompt}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-frp-brasil hover:bg-frp-petroleo focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frp-brasil disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Gerando...</>
                        ) : 'Gerar Imagem Editada'}
                    </button>

                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </div>

                {/* Image Display Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                        <h3 className="font-semibold mb-2">Original</h3>
                        <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
                            {originalImage ? <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" /> : <p className="text-gray-500">Sua imagem aqui</p>}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="font-semibold mb-2">Editada</h3>
                        <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
                            {isLoading && <p className="text-gray-500">Processando...</p>}
                            {editedImage && <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain rounded-lg" />}
                            {!isLoading && !editedImage && <p className="text-gray-500">Resultado aparecerá aqui</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorView;
