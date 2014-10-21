<?php

namespace Leyer\TranslationAdditionBundle\Templating\Helper;

use JMS\TranslationBundle\Translation\ConfigFactory;
use JMS\TranslationBundle\Translation\LoaderManager;
use JMS\TranslationBundle\Util\FileUtils;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Templating\Helper\Helper;
use Symfony\Bundle\FrameworkBundle\Templating\Helper\TranslatorHelper as BaseTranslatorHelper;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class TranslatorHelper
 *
 * @package Leyer\TranslationAdditionBundle\Templating\Helper
 */
class TranslatorHelper extends Helper
{
    /**
     * @var BaseTranslatorHelper
     */
    protected $translatorHelper;
    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @var ConfigFactory
     */
    protected $config;

    /**
     * @var RouterInterface
     */
    protected $router;

    /**
     * @param BaseTranslatorHelper $helper
     * @param TranslatorInterface  $translator
     * @param ConfigFactory        $config
     * @param RouterInterface      $router
     */
    public function __construct(
        BaseTranslatorHelper $helper,
        TranslatorInterface $translator,
        ConfigFactory $config,
        LoaderManager $loader,
        RouterInterface $router
    )
    {
        $this->translatorHelper = $helper;
        $this->translator       = $translator;
        $this->router           = $router;
        $this->loader           = $loader;
        $this->config           = $config;
    }

    /**
     * @see TranslatorInterface::trans()
     */
    public function trans($id, array $parameters = array(), $domain = 'messages', $locale = null)
    {
        if (!isset($locale)) {
            $locale = $this->translator->getLocale();
        }

        $trans = $this->translatorHelper->trans($id, $parameters, $domain, $locale);

        return $this->wrap($id, $trans, $domain, $locale);

    }

    /**
     * @see TranslatorInterface::transChoice()
     */
    public function transChoice($id, $number, array $parameters = array(), $domain = 'messages', $locale = null)
    {
        if (!isset($locale)) {
            $locale = $this->translator->getLocale();
        }

        $trans = $this->translatorHelper->transChoice($id, $number, $parameters, $domain, $locale);

        return $this->wrap($id, $trans, $domain, $locale);
    }

    /**
     * Wraps a translated value with
     * <ins class="%s" data-id="%s" data-domain="%s" data-locale="%s" data-value="%s">%s</ins>
     * Used to detect in-line edition of translations
     *
     * @param        $id
     * @param        $trans
     * @param string $domain
     * @param null   $locale
     *
     * @return string
     */
    public function wrap($id, $trans, $domain = 'messages', $locale = null)
    {
        $class = ['leyer-translator'];
        if($id === $trans) {
            $class[] = 'untranslated';
        }

        if ($config = $this->getConfigName($domain)) {
            $startTag =  vsprintf(
                "<ins class='%s' data-url='%s' data-id='%s' data-value='%s' contenteditable='false'>",
                array(
                    implode(' ', $class),
                    $this->router->generate(
                        'jms_translation_update_message',
                        [
                            'config' => $config,
                            'domain' => $domain,
                            'locale' => $locale,
                            'id'     => $id

                        ]
                    )."?id=$id",
                    $id,
                    $trans
                )
            );

            return sprintf('%s%s%s', $startTag, $trans, '</ins>');
        }

        return $trans;
    }


    /**
     * @param $domain
     *
     * @return string|null
     */
    private function getConfigName($domain)
    {
        foreach ($this->config->getNames() as $config) {
            $translationsDir = $this->config->getConfig($config, 'en')->getTranslationsDir();
            $files = FileUtils::findTranslationFiles($translationsDir);
            if (isset($files[$domain])) {
                return $config;
            }
        }
    }

    /**
     * Returns the canonical name of this helper.
     *
     * @return string The canonical name
     */
    public function getName()
    {
        return 'translator';
    }
}