import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryService } from './query.service';

@Controller('query')
export class QueryController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly queryService: QueryService
        ) {}

    /*@Get()
    async executeQuery(@Query('sql') sql:string){
        return await this.prisma.$queryRawUnsafe(sql);
    }*/

    @Get('/prodsCH')
    async getProdsCH(
        @Query('data') data: string
    ){
        return await this.queryService.getProdsCH(data);
    }
    @Get('/intprodsCH')
    async getIntProdsCH(
        @Query('data') data: string
    ){
        return await this.queryService.getIntProdsCH(data);
    }
    @Get('/int1prodsCH')
    async getIntFirstProdsCH(
        @Query('data') data: string
    ){
        return await this.queryService.getIntFirstProdsCH(data);
    }

    @Get('/qualidadeCH')
    async getQualidadeCH(
        @Query('data') data: string
    ){
        return await this.queryService.getQualidadeCH(data);
        }

    @Get('/tipoCH')
    async getTipoCH(
        @Query('data') data: string
    ){
        return await this.queryService.getTipoCH(data);
        }
    @Get('/tipo1CH')
    async getTipoPrimeiraCH(
        @Query('data') data: string
    ){
        return await this.queryService.getTipoPrimeiraCH(data);
        }
    @Get('/productCH')
    async getProductCH(
        @Query('data') data: string
    ){
        return await this.queryService.getProductCH(data);
        }
        @Get('/prods')
        async getProds(
            @Query('data') data: string
        ){
            return await this.queryService.getProds(data);
        }
        @Get('/intprods')
        async getIntProds(
            @Query('data') data: string
        ){
            return await this.queryService.getIntProds(data);
        }
        @Get('/int1prods')
        async getIntFirstProds(
            @Query('data') data: string
        ){
            return await this.queryService.getIntFirstProds(data);
        }
    
        @Get('/qualidade')
        async getQualidade(
            @Query('data') data: string
        ){
            return await this.queryService.getQualidade(data);
            }
    
        @Get('/tipo')
        async getTipo(
            @Query('data') data: string
        ){
            return await this.queryService.getTipo(data);
            }
        @Get('/tipo1')
        async getTipoPrimeira(
            @Query('data') data: string
        ){
            return await this.queryService.getTipoPrimeira(data);
            }
        @Get('/product')
        async getProduct(
            @Query('data') data: string
        ){
            return await this.queryService.getProduct(data);
            }
        

}
