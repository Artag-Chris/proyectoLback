import { Injectable } from "@nestjs/common";
import { PedidosService } from "../pedidos/pedidos.service";
import { UsuariosService } from "../usuarios/usuarios.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly pedidosService: PedidosService,
    private readonly usuariosService: UsuariosService
  ) {}

  async getMonthlyMetrics() {
    try {
      const currentYear = new Date().getFullYear();
      
      // Obtener datos de ventas de los últimos 12 meses
      const ventasTendencia = await this.pedidosService.getTendenciaVentas();
      
      // Obtener estadísticas de usuarios
      const usuariosStats = await this.usuariosService.getEstadisticasRegistros(currentYear);

      // Formatear los datos para el gráfico
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      const formattedData = monthNames.map((month, index) => {
        const ventasMes = ventasTendencia.find(v => new Date(v.mes).getMonth() === index) || { ingresos: 0 };
        const usuariosMes = usuariosStats.find(u => u.mes === index + 1) || { cantidad: 0 };

        return {
          month,
          revenue: parseFloat(ventasMes.ingresos || 0),
          users: usuariosMes.cantidad || 0
        };
      });

      return formattedData;
    } catch (error) {
      throw new Error(`Error getting monthly metrics: ${error.message}`);
    }
  }
}