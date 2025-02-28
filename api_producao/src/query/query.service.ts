import { Injectable } from '@nestjs/common';
import { LogsService } from 'src/logs/logs.service';
import { LogsEnum } from 'src/logs/enum/logs.enum';
import { PrismaSqlServerService } from 'src/prisma/prisma-sqlserver.service';

@Injectable()
export class QueryService {
  constructor(
    private readonly prisma: PrismaSqlServerService,
    private readonly logsService: LogsService
  ) {}

  async getProds(data: string) {
    return this.prisma.$queryRaw` 
            DECLARE @Data Smalldatetime
            SET @Data = Convert(Smalldatetime, ${data}, 112)
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))
            ,   Total = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop = 404
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            Group by Mpp.DtMpp
            ,        Obj.CdUndPad
            Order By Mpp.DtMpp
            `;
  }
  async getIntProds(data: string) {
    return this.prisma.$queryRaw` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))   
            ,   Inteiras = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End
			,	Total = (
                             SELECT SUM(
                                        CASE 
                                        WHEN Obj2.CdUndPad IN (67, 73) THEN ISNULL(MppIte2.QtMppite, 0) / 2
                                        ELSE ISNULL(MppIte2.QtMppite, 0)
                                        END
                                    )
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
            Group by Mpp.DtMpp, Obj.CdUndPad
            order by Mpp.DtMpp
            `;
  }
  async getIntFirstProds(data: string) {
    return this.prisma.$queryRaw` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            SELECT 
                    Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))   
                ,   Inteiras =  Case 
                                When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                                Else Sum(IsNull(MppIte.QtMppite,0)) End
                ,	Total = (
                                SELECT SUM(
                                    CASE 
                                        WHEN Obj2.CdUndPad IN (67, 73) THEN ISNULL(MppIte2.QtMppite, 0) / 2
                                        ELSE ISNULL(MppIte2.QtMppite, 0)
                                    END
                                )
                                FROM TbMppite MppIte2 
                                JOIN TbMpp Mpp2 (NOLOCK) ON Mpp2.CdMpp = MppIte2.CdMpp AND Mpp2.CdTop = 404
                                JOIN TbObj Obj2 (NOLOCK) ON Obj2.CdObj = MppIte2.CdObj AND Obj2.CdObj003 IN (4585)
                                WHERE Mpp2.DtMpp = Mpp.DtMpp
                            )

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop = 404
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            AND Obj.NmObj like  ('%W1%')
            Group by Mpp.DtMpp, Obj.CdUndPad
            order by Mpp.DtMpp
            `;
  }
  async getQualidade(data: string) {
    return this.prisma.$queryRaw` 
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
            Qt = Case 
			    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
			    Else Sum(IsNull(MppIte.QtMppite,0)) End

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
            ,Obj.CdUndPad
            `;
  }
  async getTipo(data: string) {
    return this.prisma.$queryRawUnsafe(
      ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            Select
                NmObj = UPPER(ObjMae.NmObj)
            ,	Qt = Case 
                    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                    Else Sum(IsNull(MppIte.QtMppite,0)) End
            
            From TbMppite Mppite
                Join TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 404
                Join TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
                Join TbObj ObjMae (NOLOCK) ON ObjMae.CdObj = Obj.CdObj003
            Group by ObjMae.NmObj,
            Obj.CdUndPad
           

                `
    );
  }
  async getTipoPrimeira(data: string) {
    return this.prisma.$queryRawUnsafe(
      ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            
                    Select 
                        NmObj = UPPER(ObjMae.NmObj) + ' - PRIMEIRA'
                     ,	Qt = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End
                     
                    From TbMppite Mppite
                        Join TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 404
                        Join TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
                        Join TbObj ObjMae (NOLOCK) ON ObjMae.CdObj = Obj.CdObj003
                   WHERE Obj.NmObj like  ('%W1%')
                    Group by ObjMae.NmObj, Obj.CdUndPad
           

                `
    );
  }
  async getProduct(data: string) {
    return this.prisma.$queryRaw` 
            DECLARE @Data Smalldatetime
            SET @Data = Convert(Smalldatetime, ${data}, 112)
            Select 
                NmObj = UPPER(Obj.NmObj)
            ,	Qt = Case 
                    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                    Else Sum(IsNull(MppIte.QtMppite,0)) End
            
            From TbMppite Mppite
                 JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 404
                 JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
            
            Group by Obj.NmObj,Obj.CdObj003, Obj.CdUndPad
            order by Obj.CdObj003
            `;
  }
  async getProductCH(data: string) {
    return this.prisma.$queryRaw` 
            DECLARE @Data Smalldatetime
            SET @Data = Convert(Smalldatetime, ${data}, 112)
            Select 
                NmObj = UPPER(Obj.NmObj)
            ,	Qt = Case 
                    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                    Else Sum(IsNull(MppIte.QtMppite,0)) End
            
            From TbMppite Mppite
                 JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 647
                 JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
            
            Group by Obj.NmObj,Obj.CdObj003, Obj.CdUndPad
            order by Obj.CdObj003
            `;
  }
  async getTipoPrimeiraCH(data: string) {
    return this.prisma.$queryRawUnsafe(
      ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            
                    Select 
                        NmObj = UPPER(ObjMae.NmObj) + ' - PRIMEIRA'
                     ,	Qt = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End
                     
                    From TbMppite Mppite
                        Join TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 647
                        Join TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
                        Join TbObj ObjMae (NOLOCK) ON ObjMae.CdObj = Obj.CdObj003
                   WHERE Obj.NmObj like  ('%W1%')
                    Group by ObjMae.NmObj, Obj.CdUndPad
           

                `
    );
  }
  async getTipoCH(data: string) {
    return this.prisma.$queryRawUnsafe(
      ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            Select
                NmObj = UPPER(ObjMae.NmObj)
            ,	Qt = Case 
                    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                    Else Sum(IsNull(MppIte.QtMppite,0)) End
            
            From TbMppite Mppite
                Join TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop = 647
                Join TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
                Join TbObj ObjMae (NOLOCK) ON ObjMae.CdObj = Obj.CdObj003
            Group by ObjMae.NmObj,
            Obj.CdUndPad
           

                `
    );
  }
  async getQualidadeCH(data: string) {
    return this.prisma.$queryRaw` 
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
            Qt = Case 
			    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
			    Else Sum(IsNull(MppIte.QtMppite,0)) End

        FROM 
            TbMppite Mppite
        JOIN 
            TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data AND Mpp.CdTop = 647
        JOIN 
            TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
        JOIN 
            TbOpo Opo ON Opo.CdObj = Obj.CdObj AND Opo.CdCrc = 69
        GROUP BY 
            Opo.CdOpc
            ,Obj.CdUndPad
            `;
  }
  async getIntFirstProdsCH(data: string) {
    return this.prisma.$queryRaw` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            SELECT 
                    Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))   
                ,   Inteiras =  Case 
                                When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                                Else Sum(IsNull(MppIte.QtMppite,0)) End
                ,	Total = (
                                SELECT SUM(
                                    CASE 
                                        WHEN Obj2.CdUndPad IN (67, 73) THEN ISNULL(MppIte2.QtMppite, 0) / 2
                                        ELSE ISNULL(MppIte2.QtMppite, 0)
                                    END
                                )
                                FROM TbMppite MppIte2 
                                JOIN TbMpp Mpp2 (NOLOCK) ON Mpp2.CdMpp = MppIte2.CdMpp AND Mpp2.CdTop = 647
                                JOIN TbObj Obj2 (NOLOCK) ON Obj2.CdObj = MppIte2.CdObj AND Obj2.CdObj003 IN (4585)
                                WHERE Mpp2.DtMpp = Mpp.DtMpp
                            )

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop = 647
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            AND Obj.NmObj like  ('%W1%')
            Group by Mpp.DtMpp, Obj.CdUndPad
            order by Mpp.DtMpp
            `;
  }
  async getProdsCH(data: string) {
    return this.prisma.$queryRaw` 
            DECLARE @Data Smalldatetime
            SET @Data = Convert(Smalldatetime, ${data}, 112)
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))
            ,   Total = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop = 647
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            Group by Mpp.DtMpp
            ,        Obj.CdUndPad
            Order By Mpp.DtMpp
            `;
  }
  async getIntProdsCH(data: string) {
    return this.prisma.$queryRaw` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))   
            ,   Inteiras = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End
			,	Total = (
                             SELECT SUM(
                                        CASE 
                                        WHEN Obj2.CdUndPad IN (67, 73) THEN ISNULL(MppIte2.QtMppite, 0) / 2
                                        ELSE ISNULL(MppIte2.QtMppite, 0)
                                        END
                                    )
							 FROM TbMppite Mppite2 
							 JOIN TbMpp Mpp2 (NOLOCK) ON Mpp2.CdMpp = MppIte2.CdMpp AND Mpp2.CdTop = 647
							 JOIN TbObj Obj2 (NOLOCK) ON Obj2.CdObj = MppIte2.CdObj AND Obj2.CdObj003 IN (4585, 4586, 4587, 4589)
							 WHERE Mpp2.DtMpp = Mpp.DtMpp
						)

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop = 647
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            Group by Mpp.DtMpp, Obj.CdUndPad
            order by Mpp.DtMpp
            `;
  }
  async getProductFull(data: string) {
    return this.prisma.$queryRaw` 
            DECLARE @Data Smalldatetime
            SET @Data = Convert(Smalldatetime, ${data}, 112)
            Select 
                NmObj = UPPER(Obj.NmObj)
            ,	Qt = Case 
                    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                    Else Sum(IsNull(MppIte.QtMppite,0)) End
            
            From TbMppite Mppite
                 JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop in (404,647)
                 JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
            
            Group by Obj.NmObj,Obj.CdObj003, Obj.CdUndPad
            order by Obj.CdObj003
            `;
  }
  async getTipoPrimeiraFull(data: string) {
    return this.prisma.$queryRawUnsafe(
      ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            
                    Select 
                        NmObj = UPPER(ObjMae.NmObj) + ' - PRIMEIRA'
                     ,	Qt = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End
                     
                    From TbMppite Mppite
                        Join TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop in (404,647)
                        Join TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
                        Join TbObj ObjMae (NOLOCK) ON ObjMae.CdObj = Obj.CdObj003
                   WHERE Obj.NmObj like  ('%W1%')
                    Group by ObjMae.NmObj, Obj.CdUndPad
           

                `
    );
  }
  async getTipoFull(data: string) {
    return this.prisma.$queryRawUnsafe(
      ` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            Select
                NmObj = UPPER(ObjMae.NmObj)
            ,	Qt = Case 
                    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                    Else Sum(IsNull(MppIte.QtMppite,0)) End
            
            From TbMppite Mppite
                Join TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data and Mpp.CdTop in (404,647)
                Join TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
                Join TbObj ObjMae (NOLOCK) ON ObjMae.CdObj = Obj.CdObj003
            Group by ObjMae.NmObj,
            Obj.CdUndPad
           

                `
    );
  }
  async getQualidadeFull(data: string) {
    return this.prisma.$queryRaw` 
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
            Qt = Case 
			    When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
			    Else Sum(IsNull(MppIte.QtMppite,0)) End

        FROM 
            TbMppite Mppite
        JOIN 
            TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND Mpp.DtMpp = @Data AND Mpp.CdTop in (404,647)
        JOIN 
            TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
        JOIN 
            TbOpo Opo ON Opo.CdObj = Obj.CdObj AND Opo.CdCrc = 69
        GROUP BY 
            Opo.CdOpc
            ,Obj.CdUndPad
            `;
  }
  async getIntFirstProdsFull(data: string) {
    return this.prisma.$queryRaw` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            SELECT 
                    Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))   
                ,   Inteiras =  Case 
                                When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                                Else Sum(IsNull(MppIte.QtMppite,0)) End
                ,	Total = (
                                SELECT SUM(
                                    CASE 
                                        WHEN Obj2.CdUndPad IN (67, 73) THEN ISNULL(MppIte2.QtMppite, 0) / 2
                                        ELSE ISNULL(MppIte2.QtMppite, 0)
                                    END
                                )
                                FROM TbMppite MppIte2 
                                JOIN TbMpp Mpp2 (NOLOCK) ON Mpp2.CdMpp = MppIte2.CdMpp AND Mpp2.CdTop in (404,647)
                                JOIN TbObj Obj2 (NOLOCK) ON Obj2.CdObj = MppIte2.CdObj AND Obj2.CdObj003 IN (4585)
                                WHERE Mpp2.DtMpp = Mpp.DtMpp
                            )

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop in (404,647)
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            AND Obj.NmObj like  ('%W1%')
            Group by Mpp.DtMpp, Obj.CdUndPad
            order by Mpp.DtMpp
            `;
  }
  async getProdsFull(data: string) {
    return this.prisma.$queryRaw` 
            DECLARE @Data Smalldatetime
            SET @Data = Convert(Smalldatetime, ${data}, 112)
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))
            ,   Total = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop in (404,647)
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585, 4586, 4587, 4589)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            Group by Mpp.DtMpp
            ,        Obj.CdUndPad
            Order By Mpp.DtMpp
            `;
  }
  async getIntProdsFull(data: string) {
    return this.prisma.$queryRaw` 
            Declare @Data Smalldatetime
            SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
            
            SELECT 
                Dias =  Convert(Smalldatetime,Convert(Varchar,Mpp.DtMpp,112))   
            ,   Inteiras = Case 
                            When Obj.CdUndPad in (67,73) Then Sum(IsNull(MppIte.QtMppite,0)/2)
                            Else Sum(IsNull(MppIte.QtMppite,0)) End
			,	Total = (
                             SELECT SUM(
                                        CASE 
                                        WHEN Obj2.CdUndPad IN (67, 73) THEN ISNULL(MppIte2.QtMppite, 0) / 2
                                        ELSE ISNULL(MppIte2.QtMppite, 0)
                                        END
                                    )
							 FROM TbMppite Mppite2 
							 JOIN TbMpp Mpp2 (NOLOCK) ON Mpp2.CdMpp = MppIte2.CdMpp AND Mpp2.CdTop in (404,647)
							 JOIN TbObj Obj2 (NOLOCK) ON Obj2.CdObj = MppIte2.CdObj AND Obj2.CdObj003 IN (4585, 4586, 4587, 4589)
							 WHERE Mpp2.DtMpp = Mpp.DtMpp
						)

            From TbMppite Mppite
            JOIN TbMpp Mpp (NOLOCK) ON Mpp.CdMpp = MppIte.CdMpp AND  Mpp.CdTop in (404,647)
            JOIN TbObj Obj (NOLOCK) ON Obj.CdObj = MppIte.CdObj AND Obj.CdObj003 IN (4585)
            WHERE Mpp.DtMpp >= DATEADD(DAY, -15, @Data)
            AND Mpp.DtMpp <= @Data
            Group by Mpp.DtMpp, Obj.CdUndPad
            order by Mpp.DtMpp
            `;
  }

  async rateio(data: string) {
    return this.prisma.$queryRaw`
        declare @Data smalldatetime 
        SET @Data = Convert(Smalldatetime,Convert(Varchar,${data},112))
      
        select 
            ProducaoID = P.ID
        ,	Produto = Obj.NmObj
        ,	Total = P.QuantidadeTotal
        ,	Beneficiario = B.Nome
        ,	ValorRateado = A.ValorRateado
        ,	DataRegistro = Convert(varchar,(A.DataRegistro),103 )
        ,	HoraRegistro = Convert(varchar,(A.DataRegistro),108 )
        ,	CriadoPor = Usr.NmUsr
		,	ProcessoConcluido = Case When P.ProcessoConcluido = 1 Then 'Concluido' else 'Pendente'End
        from ProdDist_Acumulos A
        Join ProdDist_Beneficiarios B on B.ID = A.BeneficiarioID
        Join ProdDist_Producoes P on P.Id  = A.ProducaoID
        Join TbObj Obj on Obj.CdObj = A.ProdutoID
        Left Join TbUsr Usr on Usr.CdUsr = P.UsrRateio
        Where	(Convert(smalldatetime, Convert(VarChar, A.DataRegistro, 112)) = @Data or IsNull(@Data, '')= '')

        `;
  }
  async getBeneficiarios() {
    return this.prisma.$queryRaw`
           SELECT Nome, Percentual 
           FROM ProdDist_Beneficiarios b 
           WHERE Ativo = 1
        `;
  }

  async rateioConcluido(producaoId: number, userId: number) {
    try {
      const result = await this.prisma.$executeRaw`
            UPDATE ProdDist_Producoes
            SET ProcessoConcluido = 1
            WHERE ID = ${producaoId}
          `;

      if (result > 0) {
        await this.logsService.createLogs(LogsEnum.RATEIO_CONCLUIDO, userId, {
          producaoId
        });
      }

      return { updatedRows: result };
    } catch (error) {
      await this.logsService.createLogs(
        LogsEnum.RATEIO_CONCLUIDO_FAILED,
        userId,
        {
          producaoId,
          errorMessage: error.message
        }
      );

      throw new Error(`Erro ao atualizar o rateio: ${error.message}`);
    }
  }
  getUserTopManager(name: string) {
    return this.prisma.$queryRaw`
            SELECT 
                  id= CdUsr 
                , usuario = NmUsr  
            FROM TbUsr 
            WHERE NmUsr LIKE ${'%' + name + '%'}
            And FlUsr = 1
        `;
  }
  getProductTopManager(product: string) {
    return this.prisma.$queryRaw`
          Select 
	            ProdutoID = Obj.CdObj
            ,	Produto = Obj.NmObj
              From TbObj Obj
              Where CdObj001= 19
              and CdObjMae not in (4591,4594,4596,4598,28169)
              and FlObjAtivo = 1
              and NmObj LIKE ${'%' + product + '%'}
        `;
  }

  async criarRateio(ProdutoID: number, QuantidadeTotal: number, Observacao: string, userId:number) {
    try {
      const result = await this.prisma.$executeRaw`
            Insert into ProdDist_Producoes (ProdutoID, QuantidadeTotal,Observacao) Values
            (
              ${ProdutoID},
              ${QuantidadeTotal},
              ${Observacao}
            )
            
          `;

      if (result > 0) {
        await this.logsService.createLogs(LogsEnum.CRIAR_RATEIO, userId, {
          ProdutoID
        });
      }

      return { createRow: result };
    } catch (error) {
      await this.logsService.createLogs(
        LogsEnum.CRIAR_RATEIO_FAILED,
        userId,
        {
          ProdutoID,
          errorMessage: error.message
        }
      );

      throw new Error(`Erro ao atualizar o rateio: ${error.message}`);
    }
  }
}
