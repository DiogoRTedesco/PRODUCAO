import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QueryService {
    constructor(private readonly prisma: PrismaService) { }

    async getProds(data:string) {
        return this.prisma.$queryRaw
            ` 
            DECLARE @Data Smalldatetime
            SET @Data = Convert(Smalldatetime, ${data}, 112)
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))
               
            ,   Total = SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte.QtMppite, 0)))


            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop = 404
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            Group by Mpp.DtMpp
            Order By Mpp.DtMpp
            `

    }
    async getIntProds(data:string) {
        return this.prisma.$queryRaw
            ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))   
            ,   Inteiras = SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte.QtMppite, 0)))
			,	Total = (
							 SELECT SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte2.QtMppite, 0)))
							 FROM TbMppite Mppite2 
							 JOIN TbMpp Mpp2 (NOLOCK) ON Mpp2.CdMpp = MppIte2.CdMpp AND Mpp2.CdTop = 404
							 JOIN TbObj Obj2 (NOLOCK) ON Obj2.CdObj = MppIte2.CdObj AND Obj2.CdObj003 IN (4585, 4586, 4587, 4589)
							 WHERE Mpp2.DtMpp = Mpp.DtMpp
						)

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop = 404
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            Group by Mpp.DtMpp
            order by Mpp.DtMpp
            `

    }
    async getIntFirstProds(data:string) {
        return this.prisma.$queryRaw
            ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))   
            ,   Inteiras = SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte.QtMppite, 0)))
			,	Total = (
							 SELECT SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte2.QtMppite, 0)))
							 FROM TbMppite Mppite2 
							 JOIN TbMpp Mpp2 (NOLOCK) ON Mpp2.CdMpp = MppIte2.CdMpp AND Mpp2.CdTop = 404
							 JOIN TbObj Obj2 (NOLOCK) ON Obj2.CdObj = MppIte2.CdObj AND Obj2.CdObj003 IN (4585, 4586, 4587, 4589)
							 WHERE Mpp2.DtMpp = Mpp.DtMpp
						)

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop = 404
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
			AND Obj.NmObj like  ('%W1%')
            Group by Mpp.DtMpp
            order by Mpp.DtMpp
            `

    }
    async getQualidade(data:string) {
        return this.prisma.$queryRaw
            ` 
            DECLARE @Data Smalldatetime
        SET @Data = Convert(Smalldatetime, ${data}, 112)
        SELECT 
            NmObj = CASE Opo.CdOpc
                WHEN 681 THEN 'PRIMEIRA'
                WHEN 682 THEN 'SEGUNDA'
                WHEN 683 THEN 'TERCEIRA'
                WHEN 684 THEN 'QUARTA'
                ELSE 'QUINTA'
            END, 
            Qt = SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte.QtMppite, 0)))
        FROM 
            TbMppite Mppite
        JOIN 
            TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data AND Mpp.CdTop = 404
        JOIN 
            TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
        JOIN 
            TbOpo Opo ON Opo.CdObj = Obj.CdObj AND Opo.CdCrc = 69
        GROUP BY 
            Opo.CdOpc
            `

    }
    async getTipo(data:string) {
        return this.prisma.$queryRawUnsafe(
            ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            Select
                NmObj = UPPER(ObjMae.NmObj)
            ,	Qt = SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte.QtMppite, 0)))
            
            From TbMppite Mppite
                Join TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 404
                Join TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
                Join TbObj ObjMae (NOLOCK) ON ObjMae.CdObj = Obj.CdObj003
            Group by ObjMae.NmObj
           

                `)

    }
    async getTipoPrimeira(data:string) {
        return this.prisma.$queryRawUnsafe(
            ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            
                    Select 
                        NmObj = UPPER(ObjMae.NmObj) + ' - PRIMEIRA'
                     ,	Qt = SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte.QtMppite, 0)))
                     
                    From TbMppite Mppite
                        Join TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 404
                        Join TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
                        Join TbObj ObjMae (NOLOCK) ON ObjMae.CdObj = Obj.CdObj003
                   WHERE Obj.NmObj like  ('%W1%')
                    Group by ObjMae.NmObj
           

                `)

    }
    async getProduct(data:string) {
        return this.prisma.$queryRaw
            ` 
            DECLARE @Data Smalldatetime
            SET @Data = Convert(Smalldatetime, ${data}, 112)
            Select 
                NmObj = UPPER(Obj.NmObj)
            ,	Qt = SUM(CONVERT(DECIMAL(19, 2), ISNULL(MppIte.QtMppite, 0)))
            
            From TbMppite Mppite
                 JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 404
                 JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
            
            Group by Obj.NmObj,Obj.CdObj003
            order by Obj.CdObj003
            `

    }
}
