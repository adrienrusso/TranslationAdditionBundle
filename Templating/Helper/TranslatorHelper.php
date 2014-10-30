<?php

namespace Leyer\TranslationAdditionBundle\Templating\Helper;

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
     * @var RouterInterface
     */
    protected $router;

    /**
     * @param BaseTranslatorHelper $helper
     * @param TranslatorInterface  $translator
     * @param RouterInterface      $router
     */
    public function __construct(
        BaseTranslatorHelper $helper,
        TranslatorInterface $translator,
        RouterInterface $router
    )
    {
        $this->translatorHelper = $helper;
        $this->translator       = $translator;
        $this->router           = $router;
    }

    /**
     * @see TranslatorInterface::trans()
     */
    public function trans($id, array $parameters = array(), $domain = 'messages', $locale = null)
    {
        $trans = $this->translatorHelper->trans($id, $parameters, $domain, $locale);

        return $this->wrap(
            $id,
            $trans,
            $this->translatorHelper->trans($id, [], $domain, $locale),
            $parameters,
            $domain
        );

    }

    /**
     * @see TranslatorInterface::transChoice()
     */
    public function transChoice($id, $number, array $parameters = array(), $domain = 'messages', $locale = null)
    {
        $trans = $this->translatorHelper->transChoice($id, $number, $parameters, $domain, $locale);

        return $this->wrap(
            $id,
            $trans,
            $this->translatorHelper->transChoice($id, $number, [], $domain, $locale),
            $parameters,
            $domain
        );
    }

    /**
     * Wraps a translated value with
     * <ins class="%s" data-id="%s" data-domain="%s" data-locale="%s" data-value="%s">%s</ins>
     * Used to detect in-line edition of translations
     *
     * @param string $id
     * @param string $trans
     * @param string $transValue
     * @param array  $parameters
     * @param string $domain
     *
     * @return string
     */
    public function wrap($id, $trans, $transValue, $parameters = [], $domain = 'messages')
    {
        $class = ['leyer-translator'];
        if ($id === $trans) {
            $class[] = 'untranslated';
        }

        $startTag =  vsprintf(
            "<ins class='%s' data-url='%s' data-id='%s' data-value='%s' data-trans-value='%s' data-parameters='%s'>",
            [
                implode(' ', $class),
                $this->router->generate(
                    'leyer_translator_message',
                    [
                        'domain' => $domain,
                        'locale' => $this->translator->getLocale(),

                    ]
                )."?id=$id",
                $id,
                $trans,
                $transValue,
                json_encode($parameters)
            ]
        );

        return sprintf('%s%s%s', $startTag, $trans, '</ins>');
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