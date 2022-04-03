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
import { AccountTransactionDTO } from '../../service/dto/account-transaction.dto';
import { AccountTransactionService } from '../../service/account-transaction.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/account-transactions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('account-transactions')
export class AccountTransactionController {
    logger = new Logger('AccountTransactionController');

    constructor(private readonly accountTransactionService: AccountTransactionService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: AccountTransactionDTO,
    })
    async getAll(@Req() req: Request): Promise<AccountTransactionDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.accountTransactionService.findAndCount({
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
        type: AccountTransactionDTO,
    })
    async getOne(@Param('id') id: number): Promise<AccountTransactionDTO> {
        return await this.accountTransactionService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create accountTransaction' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AccountTransactionDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(
        @Req() req: Request,
        @Body() accountTransactionDTO: AccountTransactionDTO,
    ): Promise<AccountTransactionDTO> {
        const created = await this.accountTransactionService.save(accountTransactionDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AccountTransaction', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update accountTransaction' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AccountTransactionDTO,
    })
    async put(
        @Req() req: Request,
        @Body() accountTransactionDTO: AccountTransactionDTO,
    ): Promise<AccountTransactionDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AccountTransaction', accountTransactionDTO.id);
        return await this.accountTransactionService.update(accountTransactionDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update accountTransaction with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AccountTransactionDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() accountTransactionDTO: AccountTransactionDTO,
    ): Promise<AccountTransactionDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AccountTransaction', accountTransactionDTO.id);
        return await this.accountTransactionService.update(accountTransactionDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete accountTransaction' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'AccountTransaction', id);
        return await this.accountTransactionService.deleteById(id);
    }
}
