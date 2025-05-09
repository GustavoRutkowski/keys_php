import Api from "./api";

type TLanguage = 'en-US' | 'pt-BR' | 'es-ES' | 'ja-JP' | 'fr-FR' | 'it-IT';

type TLanguagePair = [TLanguage, TLanguage];

class Translator {
    private static api = new Api({ url: 'https://api.mymemory.translated.net' });

    public static async translate(
        text: string,
        pair: TLanguagePair | undefined = ['en-US', 'pt-BR']
    ): Promise<string> {
        const [inputLang, outputLang] = pair;

        const translated = await this.api.get('get', {
            q: text,
            langpair: `${inputLang}|${outputLang}`
        });

        return translated;
    }
}

export default Translator;
