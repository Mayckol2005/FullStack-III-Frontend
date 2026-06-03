import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { obtenerEstudiantes, crearEstudiante, actualizarEstudianteBD, eliminarEstudianteBD } from './estudianteService';

describe('Servicio de Estudiantes: estudianteService.js', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token-valido-xyz');
    });

    afterEach(() => { vi.restoreAllMocks(); });

    it('debe capturar el error en el catch, logear el error con emoji y retornar arreglo vacío', async () => {
        fetch.mockRejectedValue(new Error('Fallo de red'));
        const resultado = await obtenerEstudiantes();
        expect(console.error).toHaveBeenCalledWith("❌ Error obteniendo estudiantes:", expect.any(Error));
        expect(resultado).toEqual([]);
    });

    it('crearEstudiante: debe retornar true si ok', async () => {
        fetch.mockResolvedValue({ ok: true });
        const res = await crearEstudiante({ nombre: 'Test' });
        expect(res).toBe(true);
    });

    it('actualizarEstudianteBD: debe retornar true si ok', async () => {
        fetch.mockResolvedValue({ ok: true });
        const res = await actualizarEstudianteBD(1, { nombre: 'Test' });
        expect(res).toBe(true);
    });

    it('eliminarEstudianteBD: debe retornar true si ok', async () => {
        fetch.mockResolvedValue({ ok: true });
        const res = await eliminarEstudianteBD(1);
        expect(res).toBe(true);
    });
});