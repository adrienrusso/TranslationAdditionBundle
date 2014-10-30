TranslationAdditionBundle
=========================

This bundles enables edition of translations directly from your application user interface using Javascript.

[![Latest Stable Version](https://poser.pugx.org/leyer/translation-addition/v/stable.svg)](https://packagist.org/packages/leyer/translation-addition) [![Total Downloads](https://poser.pugx.org/leyer/translation-addition/downloads.svg)](https://packagist.org/packages/leyer/translation-addition) [![Latest Unstable Version](https://poser.pugx.org/leyer/translation-addition/v/unstable.svg)](https://packagist.org/packages/leyer/translation-addition) [![License](https://poser.pugx.org/leyer/translation-addition/license.svg)](https://packagist.org/packages/leyer/translation-addition)


Installation
------------

Install the bundle with composer:

    composer require "leyer/translation-addition"

You have to register the  bundle in `app/AppKernel.php`:

``` php
public function registerBundles()
{
    if (in_array($this->getEnvironment(), ['dev', 'test'])) {
        $bundles[] = new Leyer\TranslationAdditionBundle\LeyerTranslationAdditionBundle();
    }
}
```

If you use the AsseticBundle, you should publish this bundle's assets:

``` yaml
assetic:
    bundles:
        - LeyerTranslationAdditionBundle
```

``` bash
php app/console assets:install --symlink web
```
    
[JQuery](https://github.com/jquery/jquery) is required for inline edition, it can be installed with [bower](http://bower.io/).

A symfony bundle is available [here](https://github.com/Spea/SpBowerBundle).
    
Usage
------------
#### Edit translation inline

Inline edition require a translation updater.

If you used [JMSTranslationBundle](https://github.com/schmittjoh/JMSTranslationBundle) an adapter updater is already available. Don't forget to add at least one configuration:

``` yaml
leyer_translation_addition:
    inline_translation: ~
    
jms_translation:
    configs:
        app:
            dir: [%kernel.root_dir%]
            output_dir: %kernel.root_dir%/Resources/translations
```

If you want to used your own updater, you must implement [TranslationUpdaterInterface](https://github.com/adrienrusso/TranslationAdditionBundle/blob/master/Model/TranslationUpdaterInterface.php) and enable your updater service in the configuration:

``` yaml
leyer_translation_addition:
    inline_translation:
        updater: my_adapter_definition
```

Register the routing in app/config/routing_dev.yml:

``` yaml
_leyer_translation_addition:
    resource: "@LeyerTranslationAdditionBundle/Resources/config/routing.yml"
    prefix:   /_trans
```

Now you must include js and css files:

``` twig
{% if app.environment == 'dev' %}
    <script src="{{ asset('bundles/leyertranslationaddition/js/translator.js') }}" type="text/javascript"></script>
{% endif %}
```

``` twig
{% if app.environment == 'dev' %}
        <link rel="stylesheet" href="{{ asset('bundles/leyertranslationaddition/css/translator.css') }}"/>
{% endif %}
```
