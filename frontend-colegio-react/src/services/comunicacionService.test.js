import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../api/apiClient';
import { obtenerAvisos, crearAviso } from './comunicacionService';

// AQUÍ ESTÁ LA MAGIA: Le decimos a Vitest la estructura exacta de nuestro apiClient
vi.mock('../api/apiClient', () => {
    return {
        default: {
            get: vi.fn(),
            post: vi.fn(),
        }
    };
});

describe('Servicio de Comunicaciones', () => {
    // Limpiamos los mocks antes de cada test para que no se mezclen
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('obtenerAvisos debe hacer una petición GET y retornar los datos', async () => {
        // 1. Preparamos la respuesta falsa que simulará dar el backend
        const mockAvisos = [
            { id: 1, titulo: 'Reunión', contenido: 'Mañana a las 8am', cursoId: 10 },
            { id: 2, titulo: 'Vacunas', contenido: 'Traer carnet', cursoId: 20 }
        ];
        
        // Ahora sí, apiClient.get existe y lo podemos configurar
        apiClient.get.mockResolvedValue({ data: mockAvisos });

        // 2. Ejecutamos la función del servicio
        const resultado = await obtenerAvisos();

        // 3. Verificamos que se llamó a la ruta correcta y devolvió lo esperado
        expect(apiClient.get).toHaveBeenCalledWith('/comunicaciones');
        expect(resultado).toEqual(mockAvisos);
    });

    it('crearAviso debe hacer una petición POST enviando los datos correctos', async () => {
        // 1. Preparamos los datos a enviar y la respuesta esperada
        const nuevoAviso = { titulo: 'Feriado', contenido: 'No hay clases', cursoId: 10 };
        const mockRespuesta = { id: 3, ...nuevoAviso };

        // Configuramos el mock para la creación
        apiClient.post.mockResolvedValue({ data: mockRespuesta });

        // 2. Ejecutamos la función del servicio
        const resultado = await crearAviso(nuevoAviso);

        // 3. Verificamos que hizo el POST a la ruta correcta, con la data correcta
        expect(apiClient.post).toHaveBeenCalledWith('/comunicaciones', nuevoAviso);
        expect(resultado).toEqual(mockRespuesta);
    });
});