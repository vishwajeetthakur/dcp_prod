from databases import Database
from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from sqlalchemy.orm import declarative_base


class Settings(BaseSettings):
    DATABASE_USERNAME: str
    DATABASE_PASSWORD: str
    MARIADB_HOST: str
    MARIADB_PORT_NUMBER: str
    MARIADB_DATABASE: str

    model_config = ConfigDict(env_file=".env", extra="allow")


settings = Settings()

DATABASE_URL = (
    f"mysql+mysqldb://{settings.DATABASE_USERNAME}:"
    f"{settings.DATABASE_PASSWORD}@{settings.MARIADB_HOST}:"
    f"{settings.MARIADB_PORT_NUMBER}/{settings.MARIADB_DATABASE}"
)

database = Database(DATABASE_URL)
Base = declarative_base()


def get_db():
    yield database
