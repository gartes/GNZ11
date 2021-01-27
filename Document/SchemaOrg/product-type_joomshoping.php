<?php
    /***********************************************************************************************************************
     * ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗  ╔╗╔╗╔╗ ╔═══╗ ╔══╗   ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
     * ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝  ║║║║║║ ║╔══╝ ║╔╗║   ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
     * ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗  ║║║║║║ ║╚══╗ ║╚╝╚╗  ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
     * ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║  ║║║║║║ ║╔══╝ ║╔═╗║  ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
     * ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║  ║╚╝╚╝║ ║╚══╗ ║╚═╝║  ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
     * ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝  ╚═╝╚═╝ ╚═══╝ ╚═══╝  ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
     *----------------------------------------------------------------------------------------------------------------------
     *
     * @author     Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date       24.11.2020 03:18
     * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
     * @license    GNU General Public License version 2 or later;
     **********************************************************************************************************************/
    defined('_JEXEC') or die; // No direct access to this file

    /* @var $displayData array */
    /* @var $self object */


    extract($displayData);

    # Микроразметка application/ld+json -> "@type":"Product"
    $doc = \Joomla\CMS\Factory::getDocument();
    $replaceArr = [
        '/\n/'=>' ',
        '/\r/'=>' ',
        '/\t/'=>' ',
        '/;&nbsp;/'=>' ',
        '/\s+/'=>' ',
        '/\s+,/'=>',',
    ];
    $url = $doc->getBase();
    $email = 'sales@pro-spec.ru' ;

    $self->product->name = $self->product->seoname ? $self->product->seoname : $self->product->name ;
    $description = preg_replace( array_keys( $replaceArr ) , $replaceArr , $self->product->description);

    require JPATH_LIBRARIES . '/Spatie/vendor/autoload.php';

    use Spatie\SchemaOrg\OfferItemCondition;
    use Spatie\SchemaOrg\Schema;
    $schemaProduct = Schema::Product()
        ->sku( $self->product->product_ean )
        ->url( $url )
        ->name( $self->product->name )
        ->image( $self->image_product_path . '/' . $self->images[0]->image_name )
        ->description( strip_tags ( $description ) )
        ->itemCondition(  OfferItemCondition::NewCondition )

        ->offers(  Schema::offer()
            ->name( $self->product->name )
            ->url( $url )
            ->price(  $self->product->getPriceCalculate()  )
            ->priceCurrency('RUB')
            ->availability( Spatie\SchemaOrg\ItemAvailability::InStock )
            //            ->priceValidUntil( (new \DateTime())->format(\DateTime::ISO8601) )
            ->priceValidUntil( $self->product->date_modify )
        ) ;


    if( $self->product->manufacturer_info->name )
    {
        $manufacturerLink = SEFLink('index.php?option=com_jshopping&controller=manufacturer&task=view&manufacturer_id='
            . $self->product->manufacturer_info->id , 2);

        # add to schemaProduct
        $schemaProduct->brand(
            Schema::Brand()
                ->name( $self->product->manufacturer_info->name )
                ->url($manufacturerLink)
        );
    }#END IF


    echo $schemaProduct->toScript();



