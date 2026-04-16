class ReptrackApi  {
    baseUrl: string | undefined;

    constructor() {
        this.baseUrl = process.env.API_URL
    }
}
