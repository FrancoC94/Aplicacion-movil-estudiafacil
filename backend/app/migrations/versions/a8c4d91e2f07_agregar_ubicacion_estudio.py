"""agregar ubicacion de estudio opcional

Revision ID: a8c4d91e2f07
Revises: 7240dde38982
Create Date: 2026-09-20
"""

from alembic import op
import sqlalchemy as sa

revision = "a8c4d91e2f07"
down_revision = "7240dde38982"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("ubicacion_estudio", sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "ubicacion_estudio")
