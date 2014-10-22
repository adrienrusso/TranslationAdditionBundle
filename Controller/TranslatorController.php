<?php

namespace Leyer\TranslationAdditionBundle\Controller;

use Leyer\TranslationAdditionBundle\Model\TranslationUpdaterInterface;
use Os\CoreBundle\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class TranslatorController
 *
 * @package Leyer\TranslationAdditionBundle\Controller
 */
class TranslatorController
{
    /**
     * @var TranslationUpdaterInterface
     */
    protected $updater;

    /**
     * @param TranslationUpdaterInterface $updater
     */
    public function __construct(TranslationUpdaterInterface $updater)
    {
        $this->updater = $updater;
    }

    /**
     * @param Request $request
     * @param string  $domain
     * @param string  $locale
     *
     * @return Response
     */
    public function messageAction(Request $request, $domain, $locale)
    {
        $this->updater->update(
            $request->query->get('id'),
            $request->get('message'),
            $domain,
            $locale
        );

        return new Response();
    }
}