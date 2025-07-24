import Api from "../utils/Api";

interface ISoftware {
    id?: number;
    name: string;
    version?: string;
}

class Softwares {
    private static api: Api = new Api({ url: 'http://localhost:2469' });

    // Listar todos os softwares
    public static async getSoftwares(): Promise<ISoftware[]> {
        const softwares = await this.api.get('softwares');
        return softwares;
    }

    // Buscar software por id
    public static async getSoftwareById(id: number): Promise<ISoftware> {
        const software = await this.api.get(`softwares/id/${id}`);
        return software;
    }

    // Criar novo software
    public static async createSoftware(data: ISoftware): Promise<ISoftware> {
        const softwareCreated = await this.api.post('softwares', data);
        return softwareCreated;
    }
}

export default Softwares;
