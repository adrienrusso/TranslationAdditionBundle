TranslationAdditionBundle
=========================

This bundle adds some translation features that can be useful during the development process.

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

Publish assets:

``` bash
php app/console assets:install --symlink web
```
    
[JQuery](https://github.com/jquery/jquery) is required for inline edition, it can be installed with [bower](http://bower.io/).

A symfony bundle is available [here](https://github.com/Spea/SpBowerBundle).
    
Usage
------------
#### Edit translation inline

Inline edition require a translation updater.

If you used [JMSTranslationBundle](https://github.com/schmittjoh/JMSTranslationBundle) an adapter updater is available. Don't forget to add at least one configuration:

``` yaml
leyer_translation_addition:
    updater: jms_updater
    
jms_translation:
    configs:
        app:
            dir: [%kernel.root_dir%]
            output_dir: %kernel.root_dir%/Resources/translations
```

If you want to used your own adapter, an interface is available [TranslationUpdaterInterface](https://github.com/adrienrusso/TranslationAdditionBundle/blob/master/Model/TranslationUpdaterInterface.php):

``` yaml
leyer_translation_addition:
    updater: my_adapter_definition
```

Now you must include js and css files:

``` twig
{% if app.environment == 'dev' %}
    <script src="{{ asset('bundles/leyertranslationaddition/js/translator.js') }}" type="text/javascript"></script>
    <script type="text/javascript">
        jQuery.noConflict();
        (function($) {
            var LeyerTranslator;
            $(function() {
                LeyerTranslator = new Leyer.Translator();
            });
        })(jQuery);
    </script>
{% endif %}
```

``` twig
{% if app.environment == 'dev' %}
        <link rel="stylesheet" href="{{ asset('bundles/leyertranslationaddition/css/translator.css') }}"/>
{% endif %}
```
