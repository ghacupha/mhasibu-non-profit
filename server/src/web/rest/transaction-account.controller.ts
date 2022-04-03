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
import { TransactionAccountDTO } from '../../service/dto/transaction-account.dto';
import { TransactionAccountService } from '../../service/transaction-account.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/transaction-accounts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('transaction-accounts')
export class TransactionAccountController {
    logger = new Logger('TransactionAccountController');

    constructor(private readonly transactionAccountService: TransactionAccountService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: TransactionAccountDTO,
    })
    async getAll(@Req() req: Request): Promise<TransactionAccountDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.transactionAccountService.findAndCount({
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
        type: TransactionAccountDTO,
    })
    async getOne(@Param('id') id: number): Promise<TransactionAccountDTO> {
        return await this.transactionAccountService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create transactionAccount' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TransactionAccountDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(
        @Req() req: Request,
        @Body() transactionAccountDTO: TransactionAccountDTO,
    ): Promise<TransactionAccountDTO> {
        const created = await this.transactionAccountService.save(transactionAccountDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionAccount', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update transactionAccount' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransactionAccountDTO,
    })
    async put(
        @Req() req: Request,
        @Body() transactionAccountDTO: TransactionAccountDTO,
    ): Promise<TransactionAccountDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionAccount', transactionAccountDTO.id);
        return await this.transactionAccountService.update(transactionAccountDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update transactionAccount with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransactionAccountDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() transactionAccountDTO: TransactionAccountDTO,
    ): Promise<TransactionAccountDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionAccount', transactionAccountDTO.id);
        return await this.transactionAccountService.update(transactionAccountDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete transactionAccount' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'TransactionAccount', id);
        return await this.transactionAccountService.deleteById(id);
    }
}
