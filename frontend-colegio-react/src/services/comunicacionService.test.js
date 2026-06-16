import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obtenerAvisos, crearAviso, eliminarAviso } from './comunicacionService';

describe('Servicio de Comunicaciones', () => {
    
    beforeEach(() => {
        vi.restoreAllMocks();
        
        // Mockear el fetch global del sistema
        vi.stubGlobal('fetch', vi.fn());
        
        // Mockear el localStorage para que devuelva un token ficticio
        vi.stubGlobal('localStorage', {
            getItem: vi.fn().mockReturnValue('token_falso_123')
        });
    });

    it('obtenerAvisos debe hacer una petición GET y retornar los datos', async () => {
        // 1. Preparamos la respuesta falsa que simulará dar el backend a través de fetch
        const mockAvisos = [
            { id: 1, titulo: 'Reunión', contenido: 'Mañana a las 8am', cursoId: 10 },
            { id: 2, titulo: 'Vacunas', contenido: 'Traer carnet', cursoId: 20 }
        ];
        
        // Configuramos fetch para que devuelva una respuesta exitosa (.ok = true) con el JSON
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockAvisos
        });

        // 2. Ejecutamos la función del servicio
        const resultado = await obtenerAvisos();

        // 3. Verificamos que fetch se llamó con la URL completa y los headers correctos
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/comunicaciones', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token_falso_123'
            }
        });
        expect(resultado).toEqual(mockAvisos);
    });

    it('crearAviso debe hacer una petición POST enviando los datos correctos con el remitente inyectado', async () => {
        // 1. Datos que envía el formulario
        const nuevoAviso = { titulo: 'Feriado', contenido: 'No hay clases', cursoId: 10 };
        
        // El servicio internamente inyecta el remitente de forma estática
        const dataEsperadaEnServidor = {
            titulo: 'Feriado',
            contenido: 'No hay clases',
            cursoId: 10,
            remitente: 'Dirección Académica'
        };

        // Configuramos fetch para simular un estado 201 Created exitoso
        fetch.mockResolvedValue({
            ok: true,
            status: 201
        });

        // 2. Ejecutamos la función
        const resultado = await crearAviso(nuevoAviso);

        // 3. Verificamos los parámetros del POST
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/comunicaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token_falso_123'
            },
            body: JSON.stringify(dataEsperadaEnServidor) // Evaluamos que viaje con el remitente
        });
        expect(resultado).toBe(true);
    });

    it('eliminarAviso debe hacer una petición DELETE a la URL correcta usando el ID', async () => {
        const idAEliminar = 5;

        // Configuramos fetch para simular éxito en el borrado
        fetch.mockResolvedValue({
            ok: true
        });

        // Ejecutamos la nueva función
        const resultado = await eliminarAviso(idAEliminar);

        // Verificamos que viaje a la URL dinámica con el método DELETE
        expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/comunicaciones/${idAEliminar}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token_falso_123'
            }
        });
        expect(resultado).toBe(true);
    });
});