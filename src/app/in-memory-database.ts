import { InMemoryDbService, InMemoryWebApiModule } from "angular-in-memory-web-api";
import { Data } from "./pages/shared/data.model";

export class InMemoryDataBase implements InMemoryDbService {

/* objeto que contem todos os itens simulados na requisição */

    createDb() {
        /* banco de dados simulado */
        const data = [
            {id: '1', name: 'Joao', age: '20', occupation: 'Estudante', city: 'SP', weight: '80', birthday: '' },
            {id: '2', name: 'Maria', age: '35', occupation: 'Motorista', city: 'MG', weight: '65', birthday: '' },
            {id: '3', name: 'Jorge', age: '70', occupation: 'Padeiro', city: 'SP', weight: '70', birthday: '' },
            {id: '4', name: 'Jana', age: '53', occupation: 'Professor', city: 'BA', weight: '55', birthday: '' },
            {id: '5', name: 'Hugo', age: '65', occupation: 'Arquiteto', city: 'RJ', weight: '67', birthday: '' }
        ]

        return { data }
    }
}