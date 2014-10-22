<?php

namespace Leyer\TranslationAdditionBundle\Controller;

use Os\CoreBundle\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class TranslatorController
 *
 * @package Leyer\TranslationAdditionBundle\Controller
 */
class TranslatorController extends Controller
{
    /**
     * @param Request $request
     * @param string  $domain
     * @param string  $locale
     *
     * @return Response
     */
    public function messageAction(Request $request, $domain, $locale)
    {
        $this->get('leyer.updater')->update(
            $request->query->get('id'),
            $request->get('message'),
            $domain,
            $locale
        );

        return new Response();
    }
}