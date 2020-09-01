import pytest

from dh2413_advanced_graphics_and_interaction.users.models import User
from dh2413_advanced_graphics_and_interaction.users.tests.factories import UserFactory


@pytest.fixture(autouse=True)
def media_storage(settings, tmpdir):
    settings.MEDIA_ROOT = tmpdir.strpath


@pytest.fixture
def user() -> User:
    return UserFactory()
