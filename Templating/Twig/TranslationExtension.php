<?php

namespace Leyer\TranslationAdditionBundle\Templating\Twig;

use Symfony\Component\Templating\Helper\HelperInterface;

/**
 * Class TranslationExtension
 *
 * @package Leyer\TranslationAdditionBundle\Templating\Twig
 */
class TranslationExtension extends \Twig_Extension
{
    /**
     * @var HelperInterface
     */
    protected $translatorHelper;

    /**
     * @param HelperInterface $translatorHelper
     */
    public function __construct(HelperInterface $translatorHelper)
    {
        $this->translatorHelper = $translatorHelper;
    }

    /**
     * @return array
     */
    public function getFilters()
    {
        return array(
            'trans' => new \Twig_Filter_Method($this, 'trans', array('pre_escape' => 'html', 'is_safe' => array('html'))),
            'transchoice' => new \Twig_Filter_Method($this, 'transchoice', array('pre_escape' => 'html', 'is_safe' => array('html'))),
        );
    }

    /**
     * @param string $message
     * @param array  $arguments
     * @param string $domain
     * @param null   $locale
     *
     * @return string
     */
    public function trans($message, array $arguments = array(), $domain = 'messages', $locale = null)
    {
        return $this->translatorHelper->trans($message, $arguments, $domain, $locale);
    }

    /**
     * @param string  $message
     * @param integer $count
     * @param array   $arguments
     * @param string  $domain
     * @param null    $locale
     * @return string
     */
    public function transchoice($message, $count, array $arguments = array(), $domain = 'messages', $locale = null)
    {
        return $this->translatorHelper->transChoice($message, $count, array_merge(array('%count%' => $count), $arguments), $domain, $locale);
    }

    /**
     * @return HelperInterface
     */
    public function getTranslator()
    {
        return $this->translatorHelper;
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'leyer_translator';
    }
}