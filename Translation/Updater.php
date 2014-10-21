<?php

namespace Leyer\TranslationAdditionBundle\Translation;

use JMS\TranslationBundle\Model\Message;
use JMS\TranslationBundle\Translation\ExtractorManager;
use JMS\TranslationBundle\Translation\FileWriter;
use JMS\TranslationBundle\Translation\LoaderManager;
use JMS\TranslationBundle\Translation\Updater as BaseUpdater;
use Symfony\Component\HttpKernel\Log\LoggerInterface;

/**
 * Class Updater
 *
 * @package Leyer\TranslationAdditionBundle\Translation
 */
class Updater extends BaseUpdater
{
    /**
     * @var LoaderManager
     */
    protected $loader;

    /**
     * @var FileWriter
     */
    protected $writer;

    public function __construct(
        LoaderManager $loader,
        ExtractorManager $extractor,
        LoggerInterface $logger,
        FileWriter $writer
    ) {
        $this->loader = $loader;
        $this->writer = $writer;
        parent::__construct($loader, $extractor, $logger, $writer);
    }


    /**
     * {@inheritDoc}
     */
    public function updateTranslation($file, $format, $domain, $locale, $id, $trans)
    {
        $catalogue = $this->loader->loadFile($file, $format, $locale, $domain);
        $message = new Message($id, $domain);
        if (!$catalogue->has($message)) {
            $message->setLocaleString($trans);
            $catalogue->add($message);

            $this->writer->write($catalogue, $domain, $file, $format);
        }

        parent::updateTranslation($file, $format, $domain, $locale, $id, $trans);
    }
}