from pydantic import BaseModel


class PatientBasic(BaseModel):
    age: int
    sex: str
    smoking: bool


class Methylation(BaseModel):
    RASSF1A: float
    SEPT9: float
    APC: float
    SFRP1: float
    LINE1: float


class miRNA(BaseModel):
    miR21: float
    miR34a: float
    miR155: float
    miR122: float


class Epigenetic(BaseModel):
    ELOVL2: float
    TRIM59: float


class PatientInput(BaseModel):
    patient: PatientBasic
    methylation: Methylation
    mirna: miRNA
    epigenetic: Epigenetic

