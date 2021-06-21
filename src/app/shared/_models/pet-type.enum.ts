enum enumPetTypes {
    BullDog = 1,
    German_Shepherd = 2,
    Labrador_Retriever = 3,
    Poodle = 4,
    Golden_Retriever = 5,
    Chihuahua = 6,
    Dachshund = 7,
    French_Bulldog = 8,
    Pomeranian = 9,
    Great_Dane = 10,
    Siberian_Husky = 11,
    Rottweiler = 12,
    Greyhound = 13,
    Bernese_Mountain_Dog = 14,
    Maltese_Dog = 15,
    Shih_Tzu = 16,
    Dobermann = 17,
    Bichon_Frise = 18,
    Charles_Spaniel = 19,
    Shiba_Inu = 20,
    Pembroke_Welsh_Corgi = 21,
    Boston_Terrier = 22,
    Basset_Hound = 23,
    Border_Colie = 24,
    Chinese_Crested_Dog = 25,
    Staffordshire_Bull_Terrier = 26,
    Havanese = 27,
    Sprinfer_Spaniel = 28,
    Sheltie = 29,
    Pointer = 30,
    Irish_Setter = 31,
    Airedale_Terrier = 32,
    Samoyed = 33,
    Chow_Chow = 34,
    Cane_Corso = 35
}

export class PetTypes {
    private enumData: { id: number; name: string }[] = [];

    constructor() {
        for (var n in enumPetTypes) {
            if (typeof enumPetTypes[n] === 'number') {
                this.enumData.push({ id: <any>enumPetTypes[n], name: n });
            }
        }
    }

    get() {
        return this.enumData;
    }

    getBy(id: any): string {
        const data = this.enumData.filter(x => { return x.id == id })[0];
        return data.name;
    }

}