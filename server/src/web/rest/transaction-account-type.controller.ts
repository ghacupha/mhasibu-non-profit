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
import { TransactionAccountTypeDTO } from '../../service/dto/transaction-account-type.dto';
import { TransactionAccountTypeService } from '../../service/transaction-account-type.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/transaction-account-types')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('transaction-account-types')
export class TransactionAccountTypeController {
    logger = new Logger('TransactionAccountTypeController');

    constructor(private readonly transactionAccountTypeService: TransactionAccountTypeService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: TransactionAccountTypeDTO,
    })
    async getAll(@Req() req: Request): Promise<TransactionAccountTypeDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.transactionAccountTypeService.findAndCount({
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
        type: TransactionAccountTypeDTO,
    })
    async getOne(@Param('id') id: number): Promise<TransactionAccountTypeDTO> {
        return await this.transactionAccountTypeService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create transactionAccountType' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TransactionAccountTypeDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(
        @Req() req: Request,
        @Body() transactionAccountTypeDTO: TransactionAccountTypeDTO,
    ): Promise<TransactionAccountTypeDTO> {
        const created = await this.transactionAccountTypeService.save(transactionAccountTypeDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionAccountType', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update transactionAccountType' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransactionAccountTypeDTO,
    })
    async put(
        @Req() req: Request,
        @Body() transactionAccountTypeDTO: TransactionAccountTypeDTO,
    ): Promise<TransactionAccountTypeDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionAccountType', transactionAccountTypeDTO.id);
        return await this.transactionAccountTypeService.update(transactionAccountTypeDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update transactionAccountType with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransactionAccountTypeDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() transactionAccountTypeDTO: TransactionAccountTypeDTO,
    ): Promise<TransactionAccountTypeDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionAccountType', transactionAccountTypeDTO.id);
        return await this.transactionAccountTypeService.update(transactionAccountTypeDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete transactionAccountType' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'TransactionAccountType', id);
        return await this.transactionAccountTypeService.deleteById(id);
    }
}
