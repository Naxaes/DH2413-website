from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    name = "dh2413_advanced_graphics_and_interaction.users"
    verbose_name = _("Users")

    def ready(self):
        try:
            import dh2413_advanced_graphics_and_interaction.users.signals  # noqa F401
        except ImportError:
            pass
