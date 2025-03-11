import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { PrismaSqlServerService } from 'src/prisma/prisma-sqlserver.service';
import { QueryService } from './query.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('query')
export class QueryController {
  constructor(
    private readonly prisma: PrismaSqlServerService,
    private readonly queryService: QueryService
  ) {}

  /*@Get()
    async executeQuery(@Query('sql') sql:string){
        return await this.prisma.$queryRawUnsafe(sql);
    }*/

  @Get('/prodsCH')
  async getProdsCH(@Query('data') data: string) {
    return await this.queryService.getProdsCH(data);
  }
  @Get('/intprodsCH')
  async getIntProdsCH(@Query('data') data: string) {
    return await this.queryService.getIntProdsCH(data);
  }
  @Get('/int1prodsCH')
  async getIntFirstProdsCH(@Query('data') data: string) {
    return await this.queryService.getIntFirstProdsCH(data);
  }

  @Get('/qualidadeCH')
  async getQualidadeCH(@Query('data') data: string) {
    return await this.queryService.getQualidadeCH(data);
  }

  @Get('/tipoCH')
  async getTipoCH(@Query('data') data: string) {
    return await this.queryService.getTipoCH(data);
  }
  @Get('/tipo1CH')
  async getTipoPrimeiraCH(@Query('data') data: string) {
    return await this.queryService.getTipoPrimeiraCH(data);
  }
  @Get('/productCH')
  async getProductCH(@Query('data') data: string) {
    return await this.queryService.getProductCH(data);
  }
  @Get('/prods')
  async getProds(@Query('data') data: string) {
    return await this.queryService.getProds(data);
  }
  @Get('/intprods')
  async getIntProds(@Query('data') data: string) {
    return await this.queryService.getIntProds(data);
  }
  @Get('/int1prods')
  async getIntFirstProds(@Query('data') data: string) {
    return await this.queryService.getIntFirstProds(data);
  }

  @Get('/qualidade')
  async getQualidade(@Query('data') data: string) {
    return await this.queryService.getQualidade(data);
  }

  @Get('/tipo')
  async getTipo(@Query('data') data: string) {
    return await this.queryService.getTipo(data);
  }
  @Get('/tipo1')
  async getTipoPrimeira(@Query('data') data: string) {
    return await this.queryService.getTipoPrimeira(data);
  }
  @Get('/product')
  async getProduct(@Query('data') data: string) {
    return await this.queryService.getProduct(data);
  }

  @Get('/prodsCxC')
  async getProdsCxC(@Query('data') data: string) {
    return await this.queryService.getProdsFull(data);
  }
  @Get('/intprodsCxC')
  async getIntProdsCxC(@Query('data') data: string) {
    return await this.queryService.getIntProdsFull(data);
  }
  @Get('/int1prodsCxC')
  async getIntFirstProdsCxC(@Query('data') data: string) {
    return await this.queryService.getIntFirstProdsFull(data);
  }

  @Get('/qualidadeCxC')
  async getQualidadeCxC(@Query('data') data: string) {
    return await this.queryService.getQualidadeFull(data);
  }

  @Get('/tipoCxC')
  async getTipoCxC(@Query('data') data: string) {
    return await this.queryService.getTipoFull(data);
  }
  @Get('/tipo1CxC')
  async getTipoPrimeiraCxC(@Query('data') data: string) {
    return await this.queryService.getTipoPrimeiraFull(data);
  }
  @Get('/productCxC')
  async getProductCxC(@Query('data') data: string) {
    return await this.queryService.getProductFull(data);
  }
  @Get('/rateio')
  async getRateio(@Query('data') data: string) {
    return await this.queryService.rateio(data);
  }

  @Get('/beneficiarios')
  async getBeneficiarios() {
    try {
      return await this.queryService.getBeneficiarios();
    } catch (error) {
      console.error('Erro ao buscar beneficiários:', error);
      throw new HttpException(
        'Erro interno ao buscar beneficiários',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updaterateio')
  async updateRateio(
    @Query('producaoId') producaoId: number,
    @Body('userId', ParseIntPipe) userId: number
  ) {
    if (!producaoId) {
      throw new BadRequestException('ProducaoID não foi fornecido.');
    }

    const resultado = await this.queryService.rateioConcluido(
      producaoId,
      userId
    );

    if (!resultado.updatedRows) {
      throw new NotFoundException(
        `Nenhum registro encontrado para ProducaoID ${producaoId}, UpdatedRows: ${resultado.updatedRows}`
      );
    }

    return {
      message: 'Operação concluída.',
      updatedRows: resultado.updatedRows
    };
  }

  @Get('/usuarioTopManager')
  async getUserTopManager(@Query('search') search: string) {
    if (!search || search.length < 3) {
      return []; // Evita consultas desnecessárias
    }
    return await this.queryService.getUserTopManager(search);
  }
  @Get('/produtoTopManager')
  async getProductTopManager(@Query('search') search: string) {
    if (!search || search.length < 3) {
      return []; // Evita consultas desnecessárias
    }
    return await this.queryService.getProductTopManager(search);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createrateio')
  async criarRateio(
    @Body('ProdutoID') ProdutoID: number,
    @Body('QuantidadeTotal', ParseIntPipe) QuantidadeTotal: number,
    @Body('Observacao') Observacao: string,
    @Body('userId', ParseIntPipe) userId: number
  ) {
    if (!ProdutoID || isNaN(ProdutoID)) {
      throw new BadRequestException('ProdutoID inválido ou não informado.');
    }
    if (!QuantidadeTotal || isNaN(QuantidadeTotal)) {
      throw new BadRequestException('QuantidadeTotal inválida ou não informada.');
    }
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('UserID inválido ou não informado.');
    }

    const resultado = await this.queryService.criarRateio(
      ProdutoID,
      QuantidadeTotal,
      Observacao,
      userId
    );

    if (!resultado.createRow) {
      throw new NotFoundException(
         `Nenhum registro inserido para ProdutoID ${ProdutoID}. CreateRows: ${resultado.createRow}`
      );
    }

    return {
      message: 'Rateio criado com sucesso!',
      createdRows: resultado.createRow
    };
  }
  @Get('/total')
  async getTotalDia(@Query('data') data: string) {
    return await this.queryService.getTotalDia(data);
  }

}
