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
import { TransactionSignatureDTO } from '../../service/dto/transaction-signature.dto';
import { TransactionSignatureService } from '../../service/transaction-signature.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/transaction-signatures')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('transaction-signatures')
export class TransactionSignatureController {
    logger = new Logger('TransactionSignatureController');

    constructor(private readonly transactionSignatureService: TransactionSignatureService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: TransactionSignatureDTO,
    })
    async getAll(@Req() req: Request): Promise<TransactionSignatureDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.transactionSignatureService.findAndCount({
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
        type: TransactionSignatureDTO,
    })
    async getOne(@Param('id') id: number): Promise<TransactionSignatureDTO> {
        return await this.transactionSignatureService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create transactionSignature' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TransactionSignatureDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(
        @Req() req: Request,
        @Body() transactionSignatureDTO: TransactionSignatureDTO,
    ): Promise<TransactionSignatureDTO> {
        const created = await this.transactionSignatureService.save(transactionSignatureDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionSignature', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update transactionSignature' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransactionSignatureDTO,
    })
    async put(
        @Req() req: Request,
        @Body() transactionSignatureDTO: TransactionSignatureDTO,
    ): Promise<TransactionSignatureDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionSignature', transactionSignatureDTO.id);
        return await this.transactionSignatureService.update(transactionSignatureDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update transactionSignature with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TransactionSignatureDTO,
    })
    async putId(
        @Req() req: Request,
        @Body() transactionSignatureDTO: TransactionSignatureDTO,
    ): Promise<TransactionSignatureDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'TransactionSignature', transactionSignatureDTO.id);
        return await this.transactionSignatureService.update(transactionSignatureDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete transactionSignature' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'TransactionSignature', id);
        return await this.transactionSignatureService.deleteById(id);
    }
}
