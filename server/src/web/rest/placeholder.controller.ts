import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PlaceholderDTO } from '../../service/dto/placeholder.dto';
import { PlaceholderService } from '../../service/placeholder.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/placeholders')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('placeholders')
export class PlaceholderController {
    logger = new Logger('PlaceholderController');

    constructor(private readonly placeholderService: PlaceholderService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PlaceholderDTO,
    })
    async getAll(@Req() req: Request): Promise<PlaceholderDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.placeholderService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PlaceholderDTO,
    })
    async getOne(@Param('id') id: number): Promise<PlaceholderDTO> {
        return await this.placeholderService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create placeholder' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PlaceholderDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() placeholderDTO: PlaceholderDTO): Promise<PlaceholderDTO> {
        const created = await this.placeholderService.save(placeholderDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Placeholder', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update placeholder' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PlaceholderDTO,
    })
    async put(@Req() req: Request, @Body() placeholderDTO: PlaceholderDTO): Promise<PlaceholderDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Placeholder', placeholderDTO.id);
        return await this.placeholderService.update(placeholderDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update placeholder with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PlaceholderDTO,
    })
    async putId(@Req() req: Request, @Body() placeholderDTO: PlaceholderDTO): Promise<PlaceholderDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Placeholder', placeholderDTO.id);
        return await this.placeholderService.update(placeholderDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete placeholder' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Placeholder', id);
        return await this.placeholderService.deleteById(id);
    }
}
