# Generated by Django 3.2.9 on 2021-12-22 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app_applications", "0005_auto_20211222_0710"),
    ]

    operations = [
        migrations.AddField(
            model_name="marketplaceapplications",
            name="image_path",
            field=models.CharField(default="", max_length=100),
            preserve_default=False,
        ),
    ]
