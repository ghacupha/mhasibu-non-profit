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
import { TransactionClassDTO } from '../../service/dto/transaction-class.dto';
import { TransactionClassService } from '../../service/transaction-class.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/transaction-classes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('transaction-classes')
export class TransactionClassController {
    logger = new Logger('TransactionClassController');

    constructor(private readonly transactionClassService: TransactionClassService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: TransactionClassDTO,
    })
    async getAll(@Req() req: Request): Promise<TransactionClassDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.transactionClassService.findAndCount({
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
        type: TransactionClassDTO,
    })
    async getOne(@Param('id') id: number): Promise<TransactionClassDTO> {
        return await this.transactionClassService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create transactionClass' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TransactionClassDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() transactionClassDTO: TransactionClassDTO): Promise<TransactionClassDTO> {
        const created = await this.transactionClassService.save(transactionClassDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionClass', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update transactionClass' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransactionClassDTO,
    })
    async put(@Req() req: Request, @Body() transactionClassDTO: TransactionClassDTO): Promise<TransactionClassDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionClass', transactionClassDTO.id);
        return await this.transactionClassService.update(transactionClassDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update transactionClass with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransactionClassDTO,
    })
    async putId(@Req() req: Request, @Body() transactionClassDTO: TransactionClassDTO): Promise<TransactionClassDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionClass', transactionClassDTO.id);
        return await this.transactionClassService.update(transactionClassDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete transactionClass' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'TransactionClass', id);
        return await this.transactionClassService.deleteById(id);
    }
}
