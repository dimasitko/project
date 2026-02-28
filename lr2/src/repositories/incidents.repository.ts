import { Pass } from "../dtos/incidents.dto"

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
}