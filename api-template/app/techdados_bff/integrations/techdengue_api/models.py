"""Modelos mínimos para integração com o upstream (Techdengue API).

A integração pode evoluir para modelos mais ricos conforme estabilizarmos o contrato.
"""

from pydantic import BaseModel, Field


class RiskAnalyzeRequest(BaseModel):
    municipio: str = Field(min_length=2)
    casos_recentes: int = Field(ge=0)
    casos_ano_anterior: int = Field(ge=0)
    populacao: int = Field(ge=1)
