import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryService } from './query.service';

@Controller('query')
export class QueryController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly queryService: QueryService
    ) { }

    /*@Get()
    async executeQuery(@Query('sql') sql:string){
        return await this.prisma.$queryRawUnsafe(sql);
    }*/

    @Get('/prodsCH')
    async getProdsCH(
        @Query('data') data: string
    ) {
        return await this.queryService.getProdsCH(data);
    }
    @Get('/intprodsCH')
    async getIntProdsCH(
        @Query('data') data: string
    ) {
        return await this.queryService.getIntProdsCH(data);
    }
    @Get('/int1prodsCH')
    async getIntFirstProdsCH(
        @Query('data') data: string
    ) {
        return await this.queryService.getIntFirstProdsCH(data);
    }

    @Get('/qualidadeCH')
    async getQualidadeCH(
        @Query('data') data: string
    ) {
        return await this.queryService.getQualidadeCH(data);
    }

    @Get('/tipoCH')
    async getTipoCH(
        @Query('data') data: string
    ) {
        return await this.queryService.getTipoCH(data);
    }
    @Get('/tipo1CH')
    async getTipoPrimeiraCH(
        @Query('data') data: string
    ) {
        return await this.queryService.getTipoPrimeiraCH(data);
    }
    @Get('/productCH')
    async getProductCH(
        @Query('data') data: string
    ) {
        return await this.queryService.getProductCH(data);
    }
    @Get('/prods')
    async getProds(
        @Query('data') data: string
    ) {
        return await this.queryService.getProds(data);
    }
    @Get('/intprods')
    async getIntProds(
        @Query('data') data: string
    ) {
        return await this.queryService.getIntProds(data);
    }
    @Get('/int1prods')
    async getIntFirstProds(
        @Query('data') data: string
    ) {
        return await this.queryService.getIntFirstProds(data);
    }

    @Get('/qualidade')
    async getQualidade(
        @Query('data') data: string
    ) {
        return await this.queryService.getQualidade(data);
    }

    @Get('/tipo')
    async getTipo(
        @Query('data') data: string
    ) {
        return await this.queryService.getTipo(data);
    }
    @Get('/tipo1')
    async getTipoPrimeira(
        @Query('data') data: string
    ) {
        return await this.queryService.getTipoPrimeira(data);
    }
    @Get('/product')
    async getProduct(
        @Query('data') data: string
    ) {
        return await this.queryService.getProduct(data);
    }

    @Get('/prodsCxC')
    async getProdsCxC(
        @Query('data') data: string
    ) {
        return await this.queryService.getProdsFull(data);
    }
    @Get('/intprodsCxC')
    async getIntProdsCxC(
        @Query('data') data: string
    ) {
        return await this.queryService.getIntProdsFull(data);
    }
    @Get('/int1prodsCxC')
    async getIntFirstProdsCxC(
        @Query('data') data: string
    ) {
        return await this.queryService.getIntFirstProdsFull(data);
    }

    @Get('/qualidadeCxC')
    async getQualidadeCxC(
        @Query('data') data: string
    ) {
        return await this.queryService.getQualidadeFull(data);
    }

    @Get('/tipoCxC')
    async getTipoCxC(
        @Query('data') data: string
    ) {
        return await this.queryService.getTipoFull(data);
    }
    @Get('/tipo1CxC')
    async getTipoPrimeiraCxC(
        @Query('data') data: string
    ) {
        return await this.queryService.getTipoPrimeiraFull(data);
    }
    @Get('/productCxC')
    async getProductCxC(
        @Query('data') data: string
    ) {
        return await this.queryService.getProductFull(data);
    }
}
