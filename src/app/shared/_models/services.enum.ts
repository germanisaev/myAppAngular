enum enumServices {
    Grooming = 1,
    Bath = 2,
    Nail_Buffiny = 3,
    Teen_Brushing = 4
}

export class Services {
    private enumData: { id: number; name: string }[] = [];
    
    constructor() {
        for (var n in enumServices) {
            if (typeof enumServices[n] === 'number') {
                this.enumData.push({ id: <any>enumServices[n], name: n });
            }
        }
    }

    get() {
       return this.enumData; 
    }

    getBy(id: number): string {
        const data = this.enumData.filter(x => { return x.id == id })[0];
        return data.name;
    }
}