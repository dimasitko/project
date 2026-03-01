import { Passes } from "../repositories/incidents.repository";
import { ApiError } from "../middleware/error-handler.middleware";

class PassesService {
    private validatePassData(dto: CreatePass) {
    if (!dto.name || dto.name.length > 20) {
      throw new ApiError(400, "VALIDATION_ERROR", "Ім'я обов'язкове і максимум 20 символів");
    }
    if (!["Вчитель", "Студент", "Інше"].includes(dto.status)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Некоректна причина");
    }
    if (!dto.date || new Date(dto.date) < new Date(new Date().setHours(0,0,0,0))) {
      throw new ApiError(400, "VALIDATION_ERROR", "Дата обов'язкова і не може бути в минулому");
    }
    if (!dto.admin || dto.admin.length > 20) {
      throw new ApiError(400, "VALIDATION_ERROR", "Ім'я адміна обов'язкове і максимум 20 символів");
    }
    if (dto.comment && dto.comment.length > 35) {
      throw new ApiError(400, "VALIDATION_ERROR", "Коментар максимум 35 символів");
    }
  }
}
