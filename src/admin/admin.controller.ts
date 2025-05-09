import { Controller, Get } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('/metrics')
    async getMonthlyMetrics() {
        const metrics = await this.adminService.getMonthlyMetrics();
        return {
            message: "Monthly metrics retrieved successfully",
            data: metrics
        };
    }
}