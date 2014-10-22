TranslationAdditionBundle
=========================

This bundle adds some translation features that can be usefull during the developpement process.

[![Latest Stable Version](https://poser.pugx.org/leyer/translation-addition/v/stable.svg)](https://packagist.org/packages/leyer/translation-addition) [![Total Downloads](https://poser.pugx.org/leyer/translation-addition/downloads.svg)](https://packagist.org/packages/leyer/translation-addition) [![Latest Unstable Version](https://poser.pugx.org/leyer/translation-addition/v/unstable.svg)](https://packagist.org/packages/leyer/translation-addition) [![License](https://poser.pugx.org/leyer/translation-addition/license.svg)](https://packagist.org/packages/leyer/translation-addition)


Installation
------------

Install the bundle with composer:

    composer require "leyer/translation-addition"

You have to register the  bundle in `app/AppKernel.php`:

    public function registerBundles()
    {
        if (in_array($this->getEnvironment(), ['dev', 'test'])) {
            $bundles[] = new Leyer\TranslationAdditionBundle\LeyerTranslationAdditionBundle();
        }
    }
    
JQuery is required for inline edition [https://github.com/jquery/jquery], it can be installed with [http://bower.io/].

A symfony bundle is available here [https://github.com/Spea/SpBowerBundle].
    
Usage
------------
#### Edit translation inline with JMSTranslationBundle

Inline edtion require the Translation Web UI of [https://github.com/schmittjoh/JMSTranslationBundle], please refer to [http://jmsyst.com/bundles/JMSTranslationBundle].

```
JMSTranslationBundle_ui:
   resource: @JMSTranslationBundle/Controller/
   type:     annotation
   prefix:   /_trans
```

At least one configuration must be present:

```
jms_translation:
    configs:
        app:
            dir: [%kernel.root_dir%]
            output_dir: %kernel.root_dir%/Resources/translations
```

The translation api is now available.

Now you must include js and css files:

```
{% if app.environment == 'dev' %}
    {% javascripts
        '@LeyerTranslationAdditionBundle/Resources/public/js/translator.js'
    %}
        <script type="text/javascript" src="{{ asset_url }}"></script>
    {% endjavascripts %}


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

```
{% if app.environment == 'dev' %}
    {% stylesheets
     	'@LeyerTranslationAdditionBundle/Resources/public/css/translator.css'
    %}
    	<link rel="stylesheet" href="{{ asset(asset_url) }}"/>
	{% endstylesheets %}
{% endif %}
```
