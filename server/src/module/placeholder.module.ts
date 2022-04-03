import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceholderController } from '../web/rest/placeholder.controller';
import { PlaceholderRepository } from '../repository/placeholder.repository';
import { PlaceholderService } from '../service/placeholder.service';

@Module({
    imports: [TypeOrmModule.forFeature([PlaceholderRepository])],
    controllers: [PlaceholderController],
    providers: [PlaceholderService],
    exports: [PlaceholderService],
})
export class PlaceholderModule {}
