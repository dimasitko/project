import type { Pass } from "../dtos/incidents.dto"

class Passes {
    private passes: Pass[]=[];

    getAll(): Pass[] {
        return this.passes;
    }

    getById(id:string) : Pass | undefined {
        return this.passes.find (p=>p.id===id );
    }

    add(pass : Pass) : Pass {
        this.passes.push(pass);
        return pass;
    }

    update(id:string, updatedData : Partial<Pass>) : Pass | undefined {
        const index = this.passes.findIndex (p=>p.id===id );
        if (index === -1) return undefined;
        
        const exPass = this.passes[index];
        const updatePass = {
            ...exPass, ...updatedData
        } as Pass;

        this.passes[index]=updatePass;
        return updatePass
    }
    
    delete(id:string) : boolean {
        const length = this.passes.length;
        this.passes = this.passes.filter(p => p.id !== id);
        return this.passes.length !== length;
    }
}

export const passes = new Passes();